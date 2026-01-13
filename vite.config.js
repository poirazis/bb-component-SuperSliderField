import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "url";
import {
  readFileSync,
  existsSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
  createWriteStream,
} from "fs";
import { createHash } from "crypto";
import * as tar from "tar";
import { validate } from "@budibase/backend-core/plugins";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

// Custom plugin to clean the dist folder before building
const clean = () => ({
  name: "clean",
  apply: "build",
  buildStart() {
    const dist = "./dist/";
    if (existsSync(dist)) {
      readdirSync(dist).forEach((path) => {
        if (path.endsWith(".tar.gz")) {
          unlinkSync(dist + path);
        }
      });
    }
  },
});

// Custom plugin to hash the JS bundle and write it in the schema
const hash = () => ({
  name: "hash",
  apply: "build",
  async writeBundle() {
    // Ensure dist directory exists
    if (!existsSync("dist")) {
      return;
    }

    // Generate JS hash
    const fileBuffer = readFileSync("dist/plugin.min.js");
    const hashSum = createHash("sha1");
    hashSum.update(fileBuffer);
    const hex = hashSum.digest("hex");

    // Read and parse existing schema from dist folder
    const schemaPath = "./dist/schema.json";
    if (!existsSync(schemaPath)) {
      return;
    }

    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

    // Write updated schema to dist folder, pretty printed as JSON again
    const newSchema = {
      ...schema,
      hash: hex,
      version: pkg.version,
    };
    writeFileSync(schemaPath, JSON.stringify(newSchema, null, 2));
  },
});

// Custom plugin to bundle up our files after building
const bundle = () => ({
  name: "bundle",
  async writeBundle() {
    // Add a small delay to ensure all files are fully written before tarring
    await new Promise((resolve) => setTimeout(resolve, 100));

    const bundleName = `${pkg.name}-${pkg.version}.tar.gz`;
    return new Promise((resolve, reject) => {
      tar
        .c({ gzip: true, cwd: "dist" }, [
          "plugin.min.js",
          "schema.json",
          "package.json",
        ])
        .pipe(createWriteStream(`dist/${bundleName}`))
        .on("finish", resolve)
        .on("error", reject);
    });
  },
});

const validateSchema = () => ({
  name: "validate-schema",
  apply: "build",
  buildStart() {
    const schema = readFileSync("schema.json", "utf8");
    validate(JSON.parse(schema));
  },
});

const inlineCssPlugin = () => {
  let collectedCss = "";

  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",

    // Collect CSS from generateBundle and inline it
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (fileName.endsWith(".css")) {
          collectedCss += chunk.source;
          // Remove CSS file from bundle
          delete bundle[fileName];
        }
      }
    },

    writeBundle() {
      if (!collectedCss) return;

      const jsPath = "dist/plugin.min.js";
      if (!existsSync(jsPath)) return;

      const jsContent = readFileSync(jsPath, "utf8");

      // Create CSS injection code that runs once at load time
      const cssInjection = `(function(){try{var d=document,s=d.createElement("style");s.textContent=${JSON.stringify(
        collectedCss
      )};d.head.appendChild(s)}catch(e){}})();`;

      // Prepend CSS injection to JS
      writeFileSync(jsPath, cssInjection + jsContent);

      // Reset for next build
      collectedCss = "";
    },
  };
};

export default defineConfig({
  plugins: [
    validateSchema(),
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4,
        },
      },
      emitCss: true, // Extract CSS from components
      preprocess: [],
    }),
    inlineCssPlugin(), // Inline CSS into JS bundle
  ],
  build: {
    target: "esnext",
    lib: {
      entry: "index.ts",
      formats: ["iife"],
      fileName: () => "plugin.min.js",
      name: "plugin",
    },
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: (id) => id === "svelte" || id.startsWith("svelte/"),
      output: {
        globals: (id) =>
          id === "svelte/store"
            ? "svelteStore"
            : id.includes("/internal")
            ? "svelteInternal"
            : "svelte",
      },
      plugins: [
        clean(),
        {
          name: "copy-and-hash-assets",
          apply: "build",
          async writeBundle() {
            // Copy schema.json and package.json to dist
            const schema = readFileSync("schema.json", "utf8");
            writeFileSync("dist/schema.json", schema);
            const packageJson = readFileSync("package.json", "utf8");
            writeFileSync("dist/package.json", packageJson);

            // Generate JS hash
            const fileBuffer = readFileSync("dist/plugin.min.js");
            const hashSum = createHash("sha1");
            hashSum.update(fileBuffer);
            const hex = hashSum.digest("hex");

            // Update schema with hash
            const parsedSchema = JSON.parse(
              readFileSync("dist/schema.json", "utf8")
            );
            const newSchema = {
              ...parsedSchema,
              hash: hex,
              version: pkg.version,
            };
            writeFileSync(
              "dist/schema.json",
              JSON.stringify(newSchema, null, 2)
            );
          },
        },
        bundle(),
      ],
    },
  },
});

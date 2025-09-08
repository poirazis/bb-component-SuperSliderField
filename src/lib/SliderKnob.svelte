<script>
  import { createEventDispatcher } from "svelte";
  import handle from "./slider.js";

  const dispatch = createEventDispatcher();

  export let pos;
  let active = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="spectrum-Slider-handle"
  style="left: {pos * 100}%;"
  use:handle
  on:dragstart={() => ((active = true), dispatch("active", true))}
  on:drag={({ detail: v }) => (pos = v)}
  on:dragend={() => ((active = false), dispatch("active", false))}
>
  <slot />
</div>

<style>
  .spectrum-Slider-handle {
    width: 12px !important;
    height: 12px !important;

    &:hover {
      cursor: pointer;
    }

    &::before {
      width: 12px !important;
      height: 12px !important;
    }
  }
</style>

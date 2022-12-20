<script>
    import { createEventDispatcher } from "svelte";
    import handle from "./slider.js";
    
    const dispatch = createEventDispatcher();

    export let pos
    let active = false

  </script>

<div
  class="spectrum-Slider-handle"
  style="left: {pos * 100}%;"
  use:handle
  on:dragstart={() => ((active = true), dispatch('active', true))}
  on:drag={({ detail: v }) => (pos = v)}
  on:dragend={() => ((active = false), dispatch('active', false))}>
    <slot />
</div>
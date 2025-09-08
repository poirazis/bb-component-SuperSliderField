<script>
  import { createEventDispatcher } from "svelte";
  import SliderKnob from "./SliderKnob.svelte";

  const dispatch = createEventDispatcher();

  export let min;
  export let max;
  export let step;
  export let value;
  export let active = false;
  export let disabled = false;

  export let sliderType;
  export let filled = false;
  export let tickSize = 0;
  export let tickLabels = true;

  let _width;
  let _steps;
  let _pos = [0, 1];
  let _ticks = [];

  $: _width = max - min;
  $: _steps = Math.ceil(_width / step);
  $: if (active) setValueFrom(_pos);
  $: if (!active) setPosFrom(value);
  $: min, max, step, tickSize, generateTicks(), clamp();

  function setValueFrom(pos) {
    value = min + Math.round(_pos[0] * _steps) * step;
    dispatch("OnChange", value);
  }

  function setPosFrom(value) {
    _pos[0] = (value - min) / _width;
  }

  function clamp() {
    setPosFrom(value);
  }

  function generateTicks() {
    _ticks = [];
    let tick = min;

    while (tick <= max) {
      _ticks.push(tick);
      tick += tickSize > step ? tickSize : step;
    }
  }
</script>

{#if sliderType === "standard"}
  <div
    class:is-disabled={disabled}
    class:spectrum-Slider--filled={filled}
    class="spectrum-Slider"
  >
    <div class="spectrum-Slider-controls">
      <div class="spectrum-Slider-track" style="width: {_pos[0] * 100}%;" />
      <SliderKnob
        bind:pos={_pos[0]}
        on:active={({ detail: v }) => (active = v)}
      />
      <div
        class="spectrum-Slider-track"
        style="width: {(1 - _pos[0]) * 100}%; "
      />
    </div>
  </div>
{:else if sliderType === "ramp"}
  <div class="spectrum-Slider spectrum-Slider--ramp">
    <div class="spectrum-Slider-controls">
      <div class="spectrum-Slider-ramp">
        <svg
          viewBox="0 0 240 16"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M240,4v8c0,2.3-1.9,4.1-4.2,4L1,9C0.4,9,0,8.5,0,8c0-0.5,0.4-1,1-1l234.8-7C238.1-0.1,240,1.7,240,4z"
          ></path>
        </svg>
      </div>
      <SliderKnob
        bind:pos={_pos[0]}
        on:active={({ detail: v }) => (active = v)}
      />
    </div>
  </div>
{:else if sliderType === "ticks"}
  <div
    class:is-disabled={disabled}
    class:spectrum-Slider--filled={filled}
    class="spectrum-Slider"
  >
    <div class="spectrum-Slider-controls">
      <div class="spectrum-Slider-track" style="width: {_pos[0] * 100}%;"></div>
      <div
        class="spectrum-Slider-ticks"
        style="padding-left: 1px; pdding-right: 1px;"
      >
        {#each _ticks as _tick}
          <div class="spectrum-Slider-tick">
            {#if tickLabels}
              <div class="spectrum-Slider-tickLabel">{_tick}</div>
            {/if}
          </div>
        {/each}
      </div>

      <SliderKnob
        bind:pos={_pos[0]}
        on:active={({ detail: v }) => (active = v)}
      />
      <div
        class="spectrum-Slider-track"
        style="width: {(1 - _pos[0]) * 100}%; "
      ></div>
    </div>
  </div>
{/if}

<style>
  .spectrum-Slider-tickLabel {
    font-size: 10px;
    color: var(--spectrum-global-color-gray-600) !important;
  }
</style>

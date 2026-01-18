<script>
  import { getContext, onDestroy } from "svelte";
  import Slider from "./lib/Slider.svelte";

  export let label;
  export let disabled;
  export let field;
  export let invisible = false;
  export let defaultValue;
  export let min = 0;
  export let max = 100;
  export let step = 10;

  export let sliderType;
  export let filled;
  export let tickSize;
  export let tickLabels;

  let formField;
  let formStep;
  let fieldState;
  let fieldApi;
  let value;

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  const formContext = getContext("form");
  const formStepContext = getContext("form-step");
  const labelPos = getContext("field-group") || "above";
  const formApi = formContext?.formApi;

  $: formStep = formStepContext ? $formStepContext || 1 : 1;
  $: formField = formApi?.registerField(
    field,
    "number",
    0,
    false,
    null,
    formStep
  );
  $: value = fieldState?.value || defaultValue || min;
  $: showLabel = labelPos === "above" || false;
  $: if ($formField) setBoundariesFromFieldSchema($formField.fieldSchema);
  $: disabled = fieldState?.disabled;

  $: unsubscribe = formField?.subscribe((value) => {
    fieldState = value?.fieldState;
    fieldApi = value?.fieldApi;
  });

  $: $component.styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      display:
        invisible && !$builderStore.inBuilder
          ? "none"
          : $component.styles.normal.display,
      opacity: invisible && $builderStore.inBuilder ? 0.6 : 1,
      "flex-direction": labelPos == "above" ? "column" : "row",
      gap: labelPos == "left" ? "0.5rem" : "0",
      "align-items": labelPos == "left" ? "center" : "stretch",
    },
  };

  // This function will check the field Schema for min / max constraints and automatically set the props
  // If no constraints are detected, it will fall back to defaults
  function setBoundariesFromFieldSchema(fieldSchema) {
    let _min = fieldSchema.constraints?.numericality?.greaterThanOrEqualTo || 1;
    let _max = fieldSchema.constraints?.numericality?.lessThanOrEqualTo || 100;
    let _label = fieldSchema.name || "Slider Input";

    builderStore.actions.updateProp("min", _min);
    builderStore.actions.updateProp("max", _max);
    builderStore.actions.updateProp("label", _label);
  }

  function handleChange(event) {
    let newValue = event.detail;
    if (value !== newValue) {
      value = newValue;
      fieldApi?.setValue(value);
    }
  }

  const handleWheel = (e) => {
    if (disabled) return;

    if (e.deltaY > 0) {
      value = value - step < min ? min : value - step;
    } else {
      value = value + step > max ? max : value + step;
    }
  };

  onDestroy(() => {
    fieldApi?.deregister();
    unsubscribe?.();
  });
</script>

<div
  class="spectrum-Form-item"
  on:wheel={handleWheel}
  use:styleable={$component.styles}
>
  {#if !field}
    <div class="welcome">Please Select a Field to get Started</div>
  {:else}
    <label
      for={fieldState?.fieldId}
      class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel"
      class:hidden={!label}
    >
      {label}
      {#if labelPos == "above"}
        <div class="spectrum-Slider-value">
          {value}
        </div>
      {/if}
    </label>
    <div class="spectrum-Form-itemField">
      <Slider
        {min}
        {max}
        {value}
        {step}
        {filled}
        {sliderType}
        {tickSize}
        {tickLabels}
        {disabled}
        on:OnChange={handleChange}
      />
    </div>

    {#if labelPos != "above"}
      <div class="spectrum-Slider-value">
        {value}
      </div>
    {/if}
  {/if}
</div>

<style>
  .spectrum-Form-item {
    display: flex;
  }

  .spectrum-FieldLabel {
    display: flex;
    justify-content: space-between;
  }
  label {
    white-space: nowrap;
  }
  label.hidden {
    padding: 0;
  }
  .spectrum-Form-itemField {
    display: block;
    position: relative;
    width: 100%;
  }
</style>

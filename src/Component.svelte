<script>
  import { getContext, onDestroy } from "svelte"
  import Slider from "./lib/Slider.svelte";

  export let label
  export let disabled
  export let field
  export let defaultValue
  export let min
  export let max
  export let step 

  export let sliderType
  export let filled
  export let tickSize
  export let tickLabels

  let formField
  let formStep
  let fieldState
  let fieldApi
  let value

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  const formContext = getContext("form");
  const formStepContext = getContext("form-step");  
  
  const labelPos = getContext("field-group")?.labelPosition || "above"
  
  const formApi = formContext?.formApi;

  $: formStep = formStepContext ? $formStepContext || 1 : 1;
  $: formField = formApi?.registerField(field, "number", 0, false, null, formStep);
  $: value = fieldState?.value || defaultValue || min
  $: showLabel = labelPos === "above" || false
  $: if ($formField) setBoundariesFromFieldSchema($formField.fieldSchema)
  $: disabled = fieldState?.disabled

  $: unsubscribe = formField?.subscribe((value) => {
    fieldState = value?.fieldState;
    fieldApi = value?.fieldApi;
  });

  // This function will check the field Schema for min / max constraints and automatically set the props
  // If no constraints are detected, it will fall back to defaults
  function setBoundariesFromFieldSchema ( fieldSchema ) {
    let _min = fieldSchema.constraints.numericality.greaterThanOrEqualTo || 1
    let _max = fieldSchema.constraints.numericality.lessThanOrEqualTo || 100
    let _label = fieldSchema.name || "Slider Input"

    builderStore.actions.updateProp("min", _min)
    builderStore.actions.updateProp("max", _max)
    builderStore.actions.updateProp("label", _label)
  }

  function handleChange( event ) {
    let newValue = event.detail
    if ( value !== newValue ) {
      value = newValue
      fieldApi.setValue(value)
    }
  }

  onDestroy(() => {
    fieldApi?.deregister();
    unsubscribe?.();  
  });

</script>

<div class="spectrum-Form-item" use:styleable={$component.styles}>

  {#if !formContext}
    <div class="placeholder">Form components need to be wrapped in a form</div>
  {:else if !field}
    <div class="welcome"> Please Select a Field to get Started </div>
  {:else}
    <label
      class:hidden={!label}
      for={fieldState?.fieldId}
      class:spectrum-FieldLabel--left={labelPos !== "above"} 
      class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel"
    >
      {showLabel ? " " : label}
    </label>
    <div class="spectrum-Form-itemField">
        <Slider 
          {label}
          {showLabel}
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
  {/if}

</div>

<style>
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
  .spectrum-FieldLabel--left {
    padding-right: var(--spectrum-global-dimension-size-200);
  }
</style>

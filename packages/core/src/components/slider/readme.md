# Slider

<!-- Auto Generated Below -->


## Overview

The Slider component displays a linear range of numbers on a slider track. A user can select one or multiple values, depending on props, by moving a slider thumb along the track.

## Usage

### Controlled

The slider component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState({ sliderValue: 0 });

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrSlider step="5" value={value} min="-25" max="25" onValueChange={handleChange}>
      <BrSliderThumb min="-15" max="15" rangeName="sliderValue" position="min" />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  );
}

render(<ControlledExample />);
```


### Key example

A Slider is composed of the parent Slider component, the Slider thumb, the Slider track (which dynamically highlights the track based on track value), and the Slider legend.

To create a Slider, create a key/value object for the Slider `value`, and reference this key for the Slider thumb `rangeName` and the Slider track `associatedRangeName` props. Use the `legend` slot for the Slider legend.

```jsx live
<BrSlider step="5" value={{ sliderValue: 15 }} min="-50" max="50">
  <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend slot="legend" />
</BrSlider>
```


### Size

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrField fullWidth={true}>
    <span>Large</span>
    <BrSlider size="Large" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
  <BrField fullWidth={true}>
    <span>Normal</span>
    <BrSlider size="Normal" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
  <BrField fullWidth={true}>
    <span>Small</span>
    <BrSlider size="Small" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
</BrContainer>
```


### Slider min-max and thumb travel

The slider thumb travel can be set separately from the min/max of the slider itself. In this example, the slider is set between -25 and 25. The thumb travel is limited to between -15 and 15.

```jsx live
<BrSlider step="5" value={{ sliderValue: 0 }} min="-25" max="25">
  <BrSliderThumb min="-15" max="15" rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend slot="legend" />
</BrSlider>
```


### Step, large step, and label step

- `step` is a slider prop that defines the increment when dragging the thumb or using the arrow keys.
- `largeStep` is a slider prop that defines the increment when holding shift and using the arrow keys.
- `labelStep` is a slider legend prop that defines the interval for the label display. If undefined, it uses the value of the slider `step` plop.

In this example, `step="5"`, `largeStep="10"`, and `labelStep="20"`

```jsx live
<BrSlider step="5" largeStep="10" value={{ sliderValue: 0 }} min="-60" max="60">
  <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend labelStep="20" slot="legend" />
</BrSlider>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                        | Default                                                                 |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `defaultValue`      | --                    | Defines the default value of the component.                                                           | `{ [key: string]: number \| number[]; }`                                                    | `undefined`                                                             |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                   | `undefined`                                                             |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| boolean`                                                                       | `'inline'`                                                              |
| `fullHeight`        | `full-height`         | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                      | `undefined`                                                             |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                                                             |
| `height`            | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `this.orientation === 'vertical' && !this.height ? '100%' : undefined`  |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-slider-${sliderId++}` ``                                         |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                                                               |
| `largeStep`         | `large-step`          | Determines the increment value when the user presses the stepper key and holds the shift key.         | `number`                                                                                    | `10`                                                                    |
| `max`               | `max`                 | Determines the maximum value for the component.                                                       | `number`                                                                                    | `100`                                                                   |
| `min`               | `min`                 | Determines the minimum value for the component.                                                       | `number`                                                                                    | `0`                                                                     |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string \| undefined`                                                                       | `undefined`                                                             |
| `orientation`       | `orientation`         | Determines the orientation of the component.                                                          | `"horizontal" \| "vertical" \| undefined`                                                   | `'horizontal'`                                                          |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                                                              |
| `step`              | `step`                | Determines the increment value when the user presses the stepper key.                                 | `number`                                                                                    | `1`                                                                     |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                                                          |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<{ [key: string]: number \| number[]; }>[] \| undefined`                    | `undefined`                                                             |
| `value`             | --                    | Defines the value of the component.                                                                   | `{ [key: string]: number \| number[]; }`                                                    | `undefined`                                                             |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `this.orientation === 'horizontal' && !this.width ? '100%' : undefined` |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: { [key: string]: number \| number[]; } \| undefined; }>`                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: { [key: string]: number \| number[]; } \| undefined; }>`                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: { [key: string]: number \| number[]; }; }>`                                                                                  |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the input

#### Returns

Type: `Promise<void>`



### `getInternalValidityState() => Promise<{ valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }>`

Method to get the validity state.

#### Returns

Type: `Promise<{ valid: boolean; firstError?: string | undefined; nativeErrors?: { [key: string]: string; } | undefined; customErrors?: { [key: string]: string; } | undefined; }>`



### `setInternalValidityState(validity: { valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }) => Promise<void>`

A method to set a custom validity state

#### Parameters

| Name       | Type                                                                                                                                                                    | Description |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `validity` | `{ valid: boolean; firstError?: string \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; customErrors?: { [key: string]: string; } \| undefined; }` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot              | Description                                          |
| ----------------- | ---------------------------------------------------- |
|                   | Passes the slider thumb and slider track.            |
| `"error-message"` | Passes a custom error message when validation fails. |
| `"hint"`          | Passes an inline hint message.                       |
| `"inline-error"`  | Passes a custom inline error message.                |
| `"legend"`        | Passes content to display as the legend.             |


----------------------------------------------



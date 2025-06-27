# Time input

<!-- Auto Generated Below -->


## Overview

The Time input component enables users to enter a time.

## Usage

### Clear button

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="With clear button" showClearButton={true}></BrTimeInput>
  <BrTimeInput
    width="320px"
    placeholder="Without clear button"
    showClearButton={false}
  ></BrTimeInput>
</BrContainer>
```


### Controlled

The time input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const TEN_MINUTES_IN_MS = 1000 * 60 * 10;
const TEN_MINUTES_AGO = new Date(Date.now() - TEN_MINUTES_IN_MS);

function ControlledExample() {
  const [value, setValue] = useState(TEN_MINUTES_AGO);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrTimeInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```


### Fill style

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="Solid" fillStyle="Solid"></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Ghost" fillStyle="Ghost"></BrTimeInput>
</BrContainer>
```


### Format options

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="12 hour format" format="12"></BrTimeInput>
  <BrTimeInput width="320px" placeholder="24 hour format" format="24"></BrTimeInput>
</BrContainer>
```


### Key example

```jsx live
<BrTimeInput width="320px" placeholder="Type in a time value"></BrTimeInput>
```


### Locale

The locale prop can be used to localize the displayed time. This example is set to Farsi/Iran.

```jsx live
<BrTimeInput width="320px" placeholder="Locale set to Iran" locale="fa-IR"></BrTimeInput>
```


### Min-max times

The min and max allowable times are set using the [International Date Time Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

```jsx live
<BrTimeInput
  width="320px"
  placeholder="Min time is set to current time"
  min={new Date()}
></BrTimeInput>
```


### Show now button

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="With now button" showNowButton={true}></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Without now button" showNowButton={false}></BrTimeInput>
</BrContainer>
```


### Size

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="Large" size="Large"></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Normal" size="Normal"></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Small" size="Small"></BrTimeInput>
</BrContainer>
```


### States

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrTimeInput width="320px" placeholder="Default state"></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Active state" active={true}></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Disabled state" disabled={true}></BrTimeInput>
  <BrTimeInput width="320px" placeholder="Required" required={true}></BrTimeInput>
</BrContainer>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                        | Default                           |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------- |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                      | `undefined`                       |
| `autoComplete`      | `auto-complete`       | Determines whether the component supports autocomplete.                                               | `string \| undefined`                                                                       | `'off'`                           |
| `autoFocus`         | `auto-focus`          | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                                                      | `undefined`                       |
| `defaultValue`      | --                    | Defines the default value of the component.                                                           | `Date \| undefined`                                                                         | `undefined`                       |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                   | `false`                           |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                          | `'tooltip'`                       |
| `fillStyle`         | `fill-style`          | Defines the fill style applied to the component.                                                      | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                         |
| `format`            | `format`              | Defines the time format of the component.                                                             | `12 \| 24`                                                                                  | `24`                              |
| `fullHeight`        | `full-height`         | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                      | `undefined`                       |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                       |
| `height`            | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                       |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-input-${timeInputId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                         |
| `largeStep`         | `large-step`          | Determines the increment value when the user clicks the stepper affordance and holds the shift key.   | `number`                                                                                    | `10`                              |
| `locale`            | `locale`              | Defines the locale of the component.                                                                  | `string`                                                                                    | `'en-US'`                         |
| `max`               | --                    | Determines the maximum value for the component.                                                       | `Date \| undefined`                                                                         | `undefined`                       |
| `min`               | --                    | Determines the minimum value for the component.                                                       | `Date \| undefined`                                                                         | `undefined`                       |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                                                    | `undefined`                       |
| `placeholder`       | `placeholder`         | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                       | `undefined`                       |
| `precision`         | `precision`           | Determines the precision of the component selection.                                                  | `"hour" \| "millisecond" \| "minute" \| "second"`                                           | `'minute'`                        |
| `readonly`          | `readonly`            | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                   | `false`                           |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                      | `undefined`                       |
| `shape`             | `shape`               | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                             | `'Rectangular'`                   |
| `showClearButton`   | `show-clear-button`   | Determines if the clear affordance is displayed in the component.                                     | `boolean \| undefined`                                                                      | `true`                            |
| `showNowButton`     | `show-now-button`     | Determines whether an affordance for selecting the current date and time with the set precision.      | `boolean`                                                                                   | `true`                            |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                        |
| `step`              | `step`                | Determines the increment value when the user clicks the stepper affordance.                           | `number`                                                                                    | `1`                               |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                    |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<Date \| undefined>[] \| undefined`                                         | `undefined`                       |
| `value`             | --                    | Defines the value of the component.                                                                   | `Date \| undefined`                                                                         | `undefined`                       |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                       |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: Date \| undefined; }>`                                                                                                       |


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

| Slot              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `"error-message"` | Enables passing a error message to the internal display. |
| `"hint"`          | Enables passing a custom hint display.                   |
| `"inline-error"`  | Passes a custom error display inline.                    |
| `"left-icon"`     | Passes an icon to the Input.                             |
| `"right-icon"`    | Passes additional content to the Input.                  |
| `"tooltip-error"` | Passes a custom error display as a tooltip.              |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"resizer"` |             |


----------------------------------------------



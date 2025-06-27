# Numeric input

<!-- Auto Generated Below -->


## Overview

The Numeric Input component enables a user to input a numeric value.

## Usage

### Clear button

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput
    width="320px"
    placeholder="With clear button"
    showClearButton={true}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Without clear button"
    showClearButton={false}
  ></BrNumericInput>
</BrContainer>
```


### Controlled

The numeric input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(1234);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrNumericInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```


### Drag to change value

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput
    width="320px"
    placeholder="Click & drag horizontally"
    dragToChangeValue="horizontal"
    min={-50}
    max={100}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Click & drag vertically"
    dragToChangeValue="vertical"
    min={-50}
    max={100}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Click & drag off"
    dragToChangeValue={false}
    min={-50}
    max={100}
  ></BrNumericInput>
</BrContainer>
```


### Fill style

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput width="320px" placeholder="Solid" fillStyle="Solid"></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Ghost" fillStyle="Ghost"></BrNumericInput>
</BrContainer>
```


### Format options

Numbers can be formatted according to the [International Number Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Formatted numerical inputs"
  formatOptions={{ useGrouping: true, maximumFractionDigits: 2, minimumFractionDigits: 2 }}
></BrNumericInput>
```


### Increment button

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput
    width="320px"
    placeholder="With increment buttons"
    showIncrementButtons={true}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Without increment buttons"
    showIncrementButtons={false}
  ></BrNumericInput>
</BrContainer>
```


### Key example

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Type in a value"
  showClearButton={false}
></BrNumericInput>
```


### Locale

The locale prop can be used to localize numbering systems. This example applies Turkish locale, where the thousands separator is a dot and the decimal seporator is a comma.

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Locale set to Turkey"
  locale="tr-TR"
  formatOptions={{ useGrouping: true, maximumFractionDigits: 2, minimumFractionDigits: 2 }}
></BrNumericInput>
```


### Max and min values

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput
    width="320px"
    placeholder="Values are limited between -10 and 10"
    min={-10}
    max={10}
  ></BrNumericInput>
</BrContainer>
```


### Size

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput width="320px" placeholder="Large" size="Large"></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Normal" size="Normal"></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Small" size="Small"></BrNumericInput>
</BrContainer>
```


### States

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput width="320px" placeholder="Default state"></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Active state" active={true}></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Disabled state" disabled={true}></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Read only" readonly={true}></BrNumericInput>
  <BrNumericInput width="320px" placeholder="Required" required={true}></BrNumericInput>
</BrContainer>
```


### Step size

Step size controls the increment when using the buttons or keyboard up/down. Large step controls the increment when holding shift + keyboard.

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Step=5, largeStep=50"
  step={5}
  largeStep={50}
></BrNumericInput>
```



## Properties

| Property                | Attribute                   | Description                                                                                                                                                                 | Type                                                                                        | Default                       |
| ----------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------- |
| `active`                | `active`                    | Determines if the component is displayed in its active state.                                                                                                               | `boolean \| undefined`                                                                      | `undefined`                   |
| `allowedKeys`           | --                          | Determines the keys that are allowed by the component.                                                                                                                      | `RegExp \| string[] \| undefined`                                                           | `undefined`                   |
| `autoComplete`          | `auto-complete`             | Determines whether the component supports autocomplete.                                                                                                                     | `string \| undefined`                                                                       | `'off'`                       |
| `autoFocus`             | `auto-focus`                | Determines whether the component autofocuses.                                                                                                                               | `boolean \| undefined`                                                                      | `undefined`                   |
| `caretOnFocus`          | `caret-on-focus`            | Determines where the text caret is placed when the component focuses.                                                                                                       | `"end" \| "selection" \| "start" \| undefined`                                              | `undefined`                   |
| `defaultValue`          | `default-value`             | Defines the default value of the component.                                                                                                                                 | `number \| undefined`                                                                       | `undefined`                   |
| `disabled`              | `disabled`                  | Determines if the component is displayed in its disabled state.                                                                                                             | `boolean`                                                                                   | `false`                       |
| `dragToChangeTolerance` | `drag-to-change-tolerance`  | Determines what pixel movement it takes to increment the value by dragging.                                                                                                 | `number \| undefined`                                                                       | `undefined`                   |
| `dragToChangeValue`     | `drag-to-change-value`      | Determines if the component allows the changing of values by dragging.                                                                                                      | `"horizontal" \| "vertical" \| boolean \| undefined`                                        | `false`                       |
| `dragToChangeValueStep` | `drag-to-change-value-step` | Determines the increment value step when dragging to change the value.                                                                                                      | `number \| undefined`                                                                       | `undefined`                   |
| `errorDisplayType`      | `error-display-type`        | Determines whether an error message should be displayed and if yes which type.                                                                                              | `"inline" \| "tooltip" \| boolean`                                                          | `'tooltip'`                   |
| `fillStyle`             | `fill-style`                | Defines the fill style applied to the component.                                                                                                                            | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                     |
| `formatOptions`         | --                          | The options for Intl.NumberFormat. See [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) | `NumberFormatOptions`                                                                       | `undefined`                   |
| `fullWidth`             | `full-width`                | Determines if the component expands to fill the available horizontal space.                                                                                                 | `boolean \| undefined`                                                                      | `undefined`                   |
| `internalId`            | `internal-id`               | The unique internal ID of the component.                                                                                                                                    | `string`                                                                                    | `` `br-input-${inputId++}` `` |
| `invalidAfterTouch`     | `invalid-after-touch`       | Defines whether the component should display an invalid state after an event and/or a specific event.                                                                       | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                     |
| `largeStep`             | `large-step`                | Determines the increment value when the user clicks the stepper affordance and holds the shift key.                                                                         | `number`                                                                                    | `10`                          |
| `locale`                | `locale`                    | Defines the locale of the component.                                                                                                                                        | `string`                                                                                    | `'en-US'`                     |
| `max`                   | `max`                       | Determines the maximum value for the component.                                                                                                                             | `number \| undefined`                                                                       | `undefined`                   |
| `maxLength`             | `max-length`                | Determines the maximum length of the value of the component.                                                                                                                | `number \| undefined`                                                                       | `undefined`                   |
| `min`                   | `min`                       | Determines the minimum value for the component.                                                                                                                             | `number \| undefined`                                                                       | `undefined`                   |
| `minLength`             | `min-length`                | Determines the minimum length of the value of the component.                                                                                                                | `number \| undefined`                                                                       | `undefined`                   |
| `name`                  | `name`                      | Defines the name associated with this component in the context of a form.                                                                                                   | `string`                                                                                    | `undefined`                   |
| `pattern`               | `pattern`                   | Determines the pattern the component must match to be valid.                                                                                                                | `string \| undefined`                                                                       | `undefined`                   |
| `placeholder`           | `placeholder`               | Determines the placeholder displayed in the component.                                                                                                                      | `string \| undefined`                                                                       | `undefined`                   |
| `readonly`              | `readonly`                  | Determines if the component is displayed in its readonly state.                                                                                                             | `boolean`                                                                                   | `false`                       |
| `required`              | `required`                  | Determines if the component is required in a form context.                                                                                                                  | `boolean \| undefined`                                                                      | `undefined`                   |
| `shape`                 | `shape`                     | Defines the shape style applied to the component.                                                                                                                           | `"Rectangular"`                                                                             | `'Rectangular'`               |
| `showClearButton`       | `show-clear-button`         | Determines if the clear affordance is displayed in the component.                                                                                                           | `boolean \| undefined`                                                                      | `true`                        |
| `showIncrementButtons`  | `show-increment-buttons`    | Determines if the increment and decrement buttons are displayed in the component.                                                                                           | `boolean \| undefined`                                                                      | `true`                        |
| `size`                  | `size`                      | Defines the size style applied to the component.                                                                                                                            | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                    |
| `step`                  | `step`                      | Determines the increment value when the user clicks the stepper affordance.                                                                                                 | `number`                                                                                    | `1`                           |
| `theme`                 | `theme`                     | Defines the theme of the component.                                                                                                                                         | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                |
| `validations`           | --                          | Defines the data validations that apply to this component.                                                                                                                  | `CustomValidator<number \| undefined>[] \| undefined`                                       | `undefined`                   |
| `value`                 | `value`                     | Defines the value of the component.                                                                                                                                         | `number \| undefined`                                                                       | `undefined`                   |
| `width`                 | `width`                     | The width in px or percentage. Token variables and calc strings are also supported.                                                                                         | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                   |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: number \| undefined; formattedValue: string \| undefined; }>`                                                                |


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



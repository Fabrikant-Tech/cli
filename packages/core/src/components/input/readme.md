# Input

<!-- Auto Generated Below -->


## Overview

The Input component enables a user to enter information.

## Usage

### Clear button

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput width="240px" showClearButton={true} value="Clear Button Shown" />
  <BrInput width="240px" showClearButton={false} value="Clear Button Hidden" />
</BrContainer>
```


### Controlled

The input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState('Type something');

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```


### Error states

Clear each input example to show its error state.

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="tooltip"
    value="Tooltip"
  />
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="inline"
    value="Inline"
  />
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="inlineTooltip"
    value="Inline tooltip"
  />
</BrContainer>
```


### Fill style

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput fillStyle="Solid" value="Solid" />
  <BrInput fillStyle="Ghost" value="Ghost" />
</BrContainer>
```


### Key example

```jsx live
<BrInput placeholder="Type in a value">
  <BrIcon slot="left-icon" iconName="A" />
</BrInput>
```


### Placeholder

```jsx live
<BrInput showClearAffordance={true} placeholder="Placeholder text" />
```


### Resize with text

Resize the input component based on the length of the entered text.

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput value="This input component dynamically resizes with text length by default" />
  <BrInput width="240px" value="The width can also be fixed" />
</BrContainer>
```


### Size

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput size="Large" value="Large" />
  <BrInput size="Normal" value="Normal" />
  <BrInput size="Small" value="Small" />
  <BrInput size="Xsmall" value="Xsmall" />
</BrContainer>
```


### States

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput value="Default" />
  <BrInput active={true} value="Active" />
  <BrInput disabled={true} value="Disabled" />
  <BrInput readonly={true} value="Read only" />
</BrContainer>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                                                                                  | Default                       |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                                                                                | `undefined`                   |
| `allowedKeys`       | --                    | Determines the keys that are allowed by the component.                                                | `RegExp \| string[] \| undefined`                                                                                                                     | `undefined`                   |
| `autoComplete`      | `auto-complete`       | Determines whether the component supports autocomplete.                                               | `string \| undefined`                                                                                                                                 | `'off'`                       |
| `autoFocus`         | `auto-focus`          | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                                                                                                                | `undefined`                   |
| `caretOnFocus`      | `caret-on-focus`      | Determines where the text caret is placed when the component focuses.                                 | `"end" \| "selection" \| "start" \| undefined`                                                                                                        | `undefined`                   |
| `defaultValue`      | `default-value`       | Defines the default value of the component.                                                           | `string \| undefined`                                                                                                                                 | `undefined`                   |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                                                                             | `false`                       |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                                                                                    | `'tooltip'`                   |
| `fillStyle`         | `fill-style`          | Defines the fill style applied to the component.                                                      | `"Ghost" \| "Solid"`                                                                                                                                  | `'Solid'`                     |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                                                                                | `undefined`                   |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                                                                              | `` `br-input-${inputId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                                                                                 | `'input'`                     |
| `largeStep`         | `large-step`          | Determines the increment value when the user clicks the stepper affordance and holds the shift key.   | `number`                                                                                                                                              | `10`                          |
| `max`               | `max`                 | Determines the maximum value for the component.                                                       | `number \| undefined`                                                                                                                                 | `undefined`                   |
| `maxLength`         | `max-length`          | Determines the maximum length of the value of the component.                                          | `number \| undefined`                                                                                                                                 | `undefined`                   |
| `min`               | `min`                 | Determines the minimum value for the component.                                                       | `number \| undefined`                                                                                                                                 | `undefined`                   |
| `minLength`         | `min-length`          | Determines the minimum length of the value of the component.                                          | `number \| undefined`                                                                                                                                 | `undefined`                   |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                                                                                                              | `undefined`                   |
| `pattern`           | `pattern`             | Determines the pattern the component must match to be valid.                                          | `string \| undefined`                                                                                                                                 | `undefined`                   |
| `placeholder`       | `placeholder`         | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                                                                                 | `undefined`                   |
| `readonly`          | `readonly`            | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                                                                             | `false`                       |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                                                                                | `undefined`                   |
| `shape`             | `shape`               | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                                                                                       | `'Rectangular'`               |
| `showClearButton`   | `show-clear-button`   | Determines if the clear affordance is displayed in the component.                                     | `boolean \| undefined`                                                                                                                                | `true`                        |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                                                                          | `'Normal'`                    |
| `step`              | `step`                | Determines the increment value when the user clicks the stepper affordance.                           | `number`                                                                                                                                              | `1`                           |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                                                                                   | `ThemeDefault`                |
| `type`              | `type`                | Determines the type of input the component supports. Provides default HTML input behaviors.           | `"date" \| "datetime-local" \| "email" \| "month" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "time" \| "url" \| "week" \| undefined` | `'text'`                      |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<string \| undefined>[] \| undefined`                                                                                                 | `undefined`                   |
| `value`             | `value`               | Defines the value of the component.                                                                   | `string \| undefined`                                                                                                                                 | `undefined`                   |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                                                           | `undefined`                   |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |


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



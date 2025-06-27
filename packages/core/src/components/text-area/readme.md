# Text area

<!-- Auto Generated Below -->


## Overview

The Text Area component enables a user to enter information.

## Usage

### Clear button

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTextArea
    placeholder="Type in a value and press enter"
    value="Text area clear button is shown by default"
    height="64px"
    fullWidth={true}
  />
  <BrTextArea
    placeholder="Type in a value and press enter"
    value="Remove text area clear button"
    showClearButton={false}
    height="64px"
    fullWidth={true}
  />
</BrContainer>
```


### Controlled

The text area component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState('Type something');

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrTextArea onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```


### Error states

The following Text Areas are set so an entry is required in the form context. Clear the contents of each text area to show the error display type.

```jsx live
<BrContainer direction="column" verticalGap="36px" width="360px">
  <BrTextArea
    placeholder="Inline error"
    required={true}
    height="64px"
    errorDisplayType="inline"
    value="Inline error"
    fullWidth={true}
  />
  <BrTextArea
    placeholder="Tooltip error"
    required={true}
    height="64px"
    errorDisplayType="tooltip"
    value="Tooltip error"
    fullWidth={true}
  />
  <BrTextArea
    placeholder="Boolean error"
    required={true}
    height="64px"
    errorDisplayType="boolean"
    value="Boolean error"
    fullWidth={true}
  />
</BrContainer>
```


### Fill style

```jsx live
<BrContainer verticalGap="16px" fullWidth={true} width="360px" direction="column">
  <BrTextArea fillStyle="Solid" fullWidth={true} height="64px" placeholder="Solid" />
  <BrTextArea fillStyle="Ghost" fullWidth={true} height="64px" placeholder="Ghost" />
</BrContainer>
```


### Key example

```jsx live
<BrContainer width="320px">
  <BrTextArea placeholder="Type in a value" height="64px" fullWidth={true}>
    <BrIcon slot="left-icon" iconName="A" />
  </BrTextArea>
</BrContainer>
```


### Size

```jsx live
<BrContainer verticalGap="16px" width="360px" direction="column">
  <BrTextArea size="Large" placeholder="Large" />
  <BrTextArea size="Normal" placeholder="Normal" />
  <BrTextArea size="Small" placeholder="Small" />
</BrContainer>
```


### States

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTextArea fullWidth={true} placeholder="Default" value="Default" />
  <BrTextArea fullWidth={true} placeholder="Active" active={true} value="Active" />
  <BrTextArea fullWidth={true} disabled={true} value="Disabled" />
  <BrTextArea fullWidth={true} readonly={true} value="Read only" />
  <BrTextArea
    fullWidth={true}
    placehloder="Typing not allowed"
    typingAllowed={false}
    value="Typing not allowed"
  />
</BrContainer>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                        | Default                             |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------- |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                      | `undefined`                         |
| `allowedKeys`       | --                    | Determines the keys that are allowed by the component.                                                | `RegExp \| string[] \| undefined`                                                           | `undefined`                         |
| `autoComplete`      | `auto-complete`       | Determines whether the component supports autocomplete.                                               | `string \| undefined`                                                                       | `'off'`                             |
| `autoFocus`         | `auto-focus`          | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                                                      | `undefined`                         |
| `caretOnFocus`      | `caret-on-focus`      | Determines where the text caret is placed when the component focuses.                                 | `"end" \| "selection" \| "start" \| undefined`                                              | `undefined`                         |
| `defaultValue`      | `default-value`       | Defines the default value of the component.                                                           | `string \| undefined`                                                                       | `undefined`                         |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                   | `false`                             |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                          | `'tooltip'`                         |
| `fillStyle`         | `fill-style`          | Defines the fill style applied to the component.                                                      | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                           |
| `fullHeight`        | `full-height`         | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                      | `undefined`                         |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                         |
| `height`            | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                         |
| `insertNewline`     | `insert-newline`      | Determines whether the element inserts a newline when the enter key is pressed.                       | `"Enter" \| "Shift-Enter" \| boolean \| undefined`                                          | `'Shift-Enter'`                     |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-textarea-${textareaId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                           |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                                                    | `undefined`                         |
| `newlineCharacter`  | `newline-character`   | New line character to use when insertNewline is enabled.                                              | `string`                                                                                    | `'\n'`                              |
| `placeholder`       | `placeholder`         | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                       | `undefined`                         |
| `readonly`          | `readonly`            | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                   | `false`                             |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                      | `undefined`                         |
| `resizeWithText`    | `resize-with-text`    | Determines whether the element should resize to fit the text.                                         | `"horizontal" \| "vertical" \| boolean \| undefined`                                        | `'vertical'`                        |
| `shape`             | `shape`               | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                             | `'Rectangular'`                     |
| `showClearButton`   | `show-clear-button`   | Determines if the clear affordance is displayed in the component.                                     | `boolean \| undefined`                                                                      | `true`                              |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                          |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                      |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<string \| undefined>[] \| undefined`                                       | `undefined`                         |
| `value`             | `value`               | Defines the value of the component.                                                                   | `string \| undefined`                                                                       | `undefined`                         |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                         |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML textarea event emits.                          | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the textarea

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
| `"left-icon"`     | Passes an icon to the Text Area.                         |
| `"right-icon"`    | Passes additional content to the Text Area.              |
| `"tooltip-error"` | Passes a custom error display as a tooltip.              |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"resizer"` |             |


----------------------------------------------



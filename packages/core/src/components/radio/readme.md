# Radio

<!-- Auto Generated Below -->


## Overview

The Radio component is an option in a radio group. A user can click the circle next to the radio to select the item from the group.

## Usage

### Controlled

The radio component can be controlled via the `checked` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrContainer direction="column" verticalGap="16px">
      <BrFieldLabel associatedInputId="demo-1">Contact preference</BrFieldLabel>
      <BrRadio
        name="contactPreference"
        id="contactPreference-email"
        value="email"
        checked={value === 'email'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-email">Email</BrFieldLabel>
      </BrRadio>
      <BrRadio
        name="contactPreference"
        id="contactPreference-text"
        value="text"
        checked={value === 'text'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-text">Text</BrFieldLabel>
      </BrRadio>
      <BrRadio
        name="contactPreference"
        id="contactPreference-mail"
        value="mail"
        checked={value === 'mail'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-mail">Mail</BrFieldLabel>
      </BrRadio>
    </BrContainer>
  );
}

render(<ControlledExample />);
```


### Key example

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrField fullWidth={false}>
    <BrFieldLabel size="Normal" associatedInputId="demo-1">
      This is a radio group.
    </BrFieldLabel>
    <BrRadio
      name="demo"
      id="demo-1"
      value="demo-1"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-1">Radio 1</BrFieldLabel>
    </BrRadio>
    <BrRadio
      name="demo"
      id="demo-2"
      value="demo-2"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-2">Radio 2</BrFieldLabel>
    </BrRadio>
    <BrRadio
      name="demo"
      id="demo-3"
      value="demo-3"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-3">Radio 3</BrFieldLabel>
    </BrRadio>
  </BrField>
</BrContainer>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                            | Default                          |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------- |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                          | `undefined`                      |
| `autoComplete`      | `auto-complete`       | Determines whether the component supports autocomplete.                                               | `string \| undefined`                                           | `'off'`                          |
| `autoFocus`         | `auto-focus`          | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                          | `undefined`                      |
| `checked`           | `checked`             | Determines if the component is checked.                                                               | `boolean \| undefined`                                          | `undefined`                      |
| `defaultChecked`    | `default-checked`     | Determines if the component is checked by default.                                                    | `boolean`                                                       | `undefined`                      |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                       | `false`                          |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                              | `'tooltip'`                      |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                        | `` `br-input-${checkboxId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`           | `'input'`                        |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                        | `undefined`                      |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                          | `undefined`                      |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                    | `'Normal'`                       |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                             | `ThemeDefault`                   |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<string \| number \| undefined>[] \| undefined` | `undefined`                      |
| `value`             | `value`               | Defines the value of the component.                                                                   | `number \| string \| undefined`                                 | `undefined`                      |


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
|                   | Passes a label to the input.                             |
| `"error-message"` | Enables passing a error message to the internal display. |
| `"hint"`          | Enables passing a custom hint display.                   |
| `"inline-error"`  | Passes a custom error display inline.                    |
| `"tooltip-error"` | Passes a custom error display as a tooltip.              |


----------------------------------------------



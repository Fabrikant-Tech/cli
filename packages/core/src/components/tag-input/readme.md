# Tag input

<!-- Auto Generated Below -->


## Overview

The Input component enables a user to enter information.

## Usage

### Adding default content

To add tags to the tag input, use the `value` prop.

```jsx live
<BrTagInput placeholder="Type in a value and press enter" value={['tag1', 'tag2']}></BrTagInput>
```

Add the label and value as a key-value pair to create a tag value that's different from the tag label.

```jsx live
<BrTagInput
  placeholder="Type in a value and press enter"
  value={[
    { label: 'tag1', value: 'tag1Value' },
    { label: 'tag2', value: 'tag2Value' },
  ]}
></BrTagInput>
```

Elements can also be added to the tag input compositionally. Use the default slot to pass the tags to the tag input, by setting the slot as `{value}-tag-content`.

```jsx live
<BrTagInput placeholder="Type in a value and press enter" value={['Hello', 'World']}>
  <BrTag slot="Hello-tag-content" fillStyle="Ghost" colorType="Constructive">
    Hello
  </BrTag>
  <BrTag slot="World-tag-content" fillStyle="Ghost" colorType="Destructive">
    World
  </BrTag>
</BrTagInput>
```


### Clear button

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput
    placeholder="Type in a value and press enter"
    value={['Tag input clear button is shown by default']}
    fullWidth={true}
  />
  <BrTagInput
    placeholder="Type in a value and press enter"
    value={['Remove tag input clear button']}
    fullWidth={true}
    showClearButton={false}
  />
</BrContainer>
```


### Controlled

The tag input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(['tag1', 'tag2']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrTagInput
      placeholder="Type in a value and press enter"
      value={value}
      onValueChange={handleChange}
    />
  );
}

render(<ControlledExample />);
```


### Create value on enter

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput placeholder="This generates a tag on enter" fullWidth={true} />
  <BrTagInput
    placeholder="This does not generate a tag on enter"
    fullWidth={true}
    createValueOnEnter={false}
  />
</BrContainer>
```


### Error states

The following Tag Inputs are set so a component is required in the form context. Clear the contents of each tag input to show the error display type.

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput
    placeholder="Inline error"
    required={true}
    errorDisplayType="inline"
    value={['Inline error']}
    fullWidth={true}
  />
  <BrTagInput
    placeholder="Tooltip error"
    required={true}
    errorDisplayType="tooltip"
    value={['Tooltip error']}
    fullWidth={true}
  />
  <BrTagInput
    placeholder="Boolean error"
    required={true}
    errorDisplayType="boolean"
    value={['Boolean error']}
    fullWidth={true}
  />
</BrContainer>
```


### Fill style

```jsx live
<BrContainer verticalGap="16px" fullWidth={true} width="360px" direction="column">
  <BrTagInput fillStyle="Solid" fullWidth={true} placeholder="Solid" />
  <BrTagInput fillStyle="Ghost" fullWidth={true} placeholder="Ghost" />
</BrContainer>
```


### Key example

```jsx live
<BrContainer width="320px">
  <BrTagInput placeholder="Type in a value and press enter" fullWidth={true} />
</BrContainer>
```


### Size

```jsx live
<BrContainer verticalGap="16px" width="360px" direction="column">
  <BrTagInput size="Large" placeholder="Large" />
  <BrTagInput size="Normal" placeholder="Normal" />
  <BrTagInput size="Small" placeholder="Small" />
</BrContainer>
```


### States

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput fullWidth={true} placeholder="Default" value={['Default']} />
  <BrTagInput fullWidth={true} placeholder="Active" active={true} value={['Active']} />
  <BrTagInput fullWidth={true} disabled={true} value={['Disabled']} />
  <BrTagInput fullWidth={true} readonly={true} value={['Read only']} />
  <BrTagInput
    fullWidth={true}
    placeholder="Typing not allowed"
    typingAllowed={false}
    value={['Typing not allowed']}
  />
</BrContainer>
```



## Properties

| Property             | Attribute               | Description                                                                                           | Type                                                                                        | Default                              |
| -------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------ |
| `active`             | `active`                | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                      | `undefined`                          |
| `allowedKeys`        | --                      | Determines the keys that are allowed by the component.                                                | `RegExp \| string[] \| undefined`                                                           | `undefined`                          |
| `autoFocus`          | `auto-focus`            | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                                                      | `undefined`                          |
| `clearFilterOnBlur`  | `clear-filter-on-blur`  | Determines if the type value is cleared on blur.                                                      | `boolean`                                                                                   | `true`                               |
| `createValueOnEnter` | `create-value-on-enter` | Determines if the component allows the creation of new values on enter.                               | `boolean \| undefined`                                                                      | `true`                               |
| `defaultValue`       | --                      | Defines the default value of the component.                                                           | `string[] \| undefined \| { label: string; value: any; }[]`                                 | `undefined`                          |
| `disabled`           | `disabled`              | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                   | `false`                              |
| `errorDisplayType`   | `error-display-type`    | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                          | `'tooltip'`                          |
| `fillStyle`          | `fill-style`            | Defines the fill style applied to the component.                                                      | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                            |
| `filterValue`        | `filter-value`          | Determines the typed value next to the tags.                                                          | `string \| undefined`                                                                       | `undefined`                          |
| `fullHeight`         | `full-height`           | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                      | `undefined`                          |
| `fullWidth`          | `full-width`            | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                          |
| `height`             | `height`                | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                          |
| `internalId`         | `internal-id`           | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-tag-input-${taginputId++}` `` |
| `invalidAfterTouch`  | `invalid-after-touch`   | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                            |
| `name`               | `name`                  | Defines the name associated with this component in the context of a form.                             | `string`                                                                                    | `undefined`                          |
| `placeholder`        | `placeholder`           | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                       | `undefined`                          |
| `readonly`           | `readonly`              | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                   | `false`                              |
| `required`           | `required`              | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                      | `undefined`                          |
| `shape`              | `shape`                 | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                             | `'Rectangular'`                      |
| `showClearButton`    | `show-clear-button`     | Determines if the clear affordance is displayed in the component.                                     | `boolean \| undefined`                                                                      | `true`                               |
| `size`               | `size`                  | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                           |
| `theme`              | `theme`                 | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                       |
| `typingAllowed`      | `typing-allowed`        | Determines wether typing in the input is allowed.                                                     | `boolean \| undefined`                                                                      | `undefined`                          |
| `validations`        | --                      | Defines the data validations that apply to this component.                                            | `CustomValidator<string[] \| { label: string; value: any; }[] \| undefined>[] \| undefined` | `undefined`                          |
| `value`              | --                      | Defines the value of the component.                                                                   | `string[] \| undefined \| { label: string; value: any; tagProps?: object \| undefined; }[]` | `undefined`                          |
| `width`              | `width`                 | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                          |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string[] \| { label: string; value: string; tagProps?: object \| undefined; }[] \| undefined; }>`                            |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: string[] \| { label: string; value: string; tagProps?: object \| undefined; }[] \| undefined; }>`                            |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: string[] \| { label: string; value: string; tagProps?: object \| undefined; }[] \| undefined; }>`                            |


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

| Slot                      | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
|                           | Passes the tags to the Tag Input.                                                        |
| `"error-message"`         | Enables passing a error message to the internal display.                                 |
| `"hint"`                  | Enables passing a custom hint display.                                                   |
| `"inline-error"`          | Passes a custom error display inline.                                                    |
| `"left-icon"`             | Passes an icon to the Input.                                                             |
| `"right-icon"`            | Passes additional content to the Input.                                                  |
| `"tooltip-error"`         | Passes a custom error display as a tooltip.                                              |
| `"{{label}}-tag-content"` | Dynamic slot name that allows passing custom rendered content to each tag input element. |


## Shadow Parts

| Part                  | Description |
| --------------------- | ----------- |
| `"resizer"`           |             |
| `"tag-input-wrapper"` |             |


----------------------------------------------



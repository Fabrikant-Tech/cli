# File upload



<!-- Auto Generated Below -->


## Overview

The File Upload component enables a user to attach files.

## Usage

### Controlled

The file upload component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrFileUpload onValueChange={handleChange} value={value} height="64px" width="320px" />;
}

render(<ControlledExample />);
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                                                    | Default                                |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `acceptedFileTypes` | --                    | Determines the file types accepted by the component.                                                  | `CommonFileExtension[] \| CommonFileTypes[] \| string[]`                                                                | `[]`                                   |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                                                  | `undefined`                            |
| `defaultValue`      | --                    | Defines the default value of the component.                                                           | `File[] \| undefined`                                                                                                   | `undefined`                            |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                                               | `false`                                |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                                                      | `'tooltip'`                            |
| `fileDetails`       | --                    | Determines the file details displayed by the component.                                               | `undefined \| { name: "file-name" \| "file-name-extension"; size?: true \| "b" \| "Mb" \| "Kb" \| "Gb" \| undefined; }` | `undefined`                            |
| `fullHeight`        | `full-height`         | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                                                  | `undefined`                            |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                                                  | `undefined`                            |
| `height`            | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                             | `undefined`                            |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                                                | `` `br-file-input-${fileInputId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                                                   | `'input'`                              |
| `maxFileSize`       | `max-file-size`       | Determines the max file size in bytes accepted by the component.                                      | `number \| undefined`                                                                                                   | `undefined`                            |
| `multiple`          | `multiple`            | Determines if the component accepts multiple values.                                                  | `boolean \| undefined`                                                                                                  | `undefined`                            |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                                                                                | `undefined`                            |
| `placeholder`       | `placeholder`         | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                                                   | `undefined`                            |
| `readonly`          | `readonly`            | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                                               | `false`                                |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                                                  | `undefined`                            |
| `showBrowseButton`  | `show-browse-button`  | Determines if the component displays a browse affordance.                                             | `boolean \| undefined`                                                                                                  | `false`                                |
| `showFiles`         | `show-files`          | Determines if the component displays files that have been selected.                                   | `boolean \| undefined`                                                                                                  | `true`                                 |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small"`                                                                                        | `'Normal'`                             |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                                                     | `ThemeDefault`                         |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<File[] \| undefined>[] \| undefined`                                                                   | `undefined`                            |
| `value`             | --                    | Defines the value of the component.                                                                   | `File[] \| undefined`                                                                                                   | `undefined`                            |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                             | `undefined`                            |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: File[] \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: File[] \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: File[] \| undefined; }>`                                                                                                     |


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

| Slot                                | Description                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `"browse-button"`                   | Passes a custom browse button.                                                      |
| `"browse-button-label"`             | Passes a label to the browse button.                                                |
| `"error-message"`                   | Enables passing a error message to the internal display.                            |
| `"icon"`                            | Passes an icon to the component.                                                    |
| `"inline-error"`                    | Passes a custom error display inline.                                               |
| `"placeholder"`                     | Passes a placeholder to the component.                                              |
| `"tooltip-error"`                   | Passes a custom error display as a tooltip.                                         |
| `"{{file-name}}-file-item-content"` | Dynamic slot name that allows passing custom rendered content to each file element. |
| `"{{file-name}}-file-item-preview"` | Dynamic slot name that allows passing a custom preview to each file.                |


----------------------------------------------



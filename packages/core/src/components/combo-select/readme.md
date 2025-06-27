# Combo select



<!-- Auto Generated Below -->


## Overview

The Select component is a dropdown list of items. Users can pick one item from the list.

## Usage

### Controlled

The combo select component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const DOG_BREEDS = [
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'Australian Shepherd',
  'Basset Hound',
  'Beagle',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Bloodhound',
  'Border Collie',
];

function ControlledExample() {
  const [value, setValue] = useState(['Akita']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrComboSelect onValueChange={handleChange} value={value}>
      <BrPopover>
        <BrInput fullWidth={true} slot="target">
          <BrSingleSelectIcon slot="left-icon" />
          <BrSingleSelectIndicator />
        </BrInput>
        <BrPopoverContent>
          <BrSelectList fullWidth={true}>
            {DOG_BREEDS.map((dog) => {
              return (
                <BrSelectListItem key={dog} fullWidth={true} value={dog}>
                  <span>{dog}</span>
                </BrSelectListItem>
              );
            })}
          </BrSelectList>
        </BrPopoverContent>
      </BrPopover>
    </BrComboSelect>
  );
}

render(<ControlledExample />);
```



## Properties

| Property                      | Attribute                        | Description                                                                                           | Type                                                                                        | Default                                    |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `defaultValue`                | --                               | Defines the default value of the component.                                                           | `any[] \| undefined`                                                                        | `undefined`                                |
| `errorDisplayType`            | `error-display-type`             | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                          | `'inline'`                                 |
| `fullWidth`                   | `full-width`                     | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                                |
| `internalId`                  | `internal-id`                    | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-combo-select-${comboSelectId++}` `` |
| `invalidAfterTouch`           | `invalid-after-touch`            | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| boolean`                                                  | `'click'`                                  |
| `name`                        | `name`                           | Defines the name associated with this component in the context of a form.                             | `string`                                                                                    | `undefined`                                |
| `required`                    | `required`                       | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                      | `undefined`                                |
| `selectingSameValueDeselects` | `selecting-same-value-deselects` | Determines if a previously selected value is deselected when the user selects it again.               | `boolean`                                                                                   | `true`                                     |
| `shape`                       | `shape`                          | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                             | `'Rectangular'`                            |
| `shouldCloseOnSelect`         | `should-close-on-select`         | Determines if the component closes the popover when a user selects an item.                           | `boolean`                                                                                   | `true`                                     |
| `size`                        | `size`                           | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                                 |
| `theme`                       | `theme`                          | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                             |
| `typeahead`                   | `typeahead`                      | Determines whether the component focuses an item as the user types.                                   | `boolean \| undefined`                                                                      | `true`                                     |
| `validations`                 | --                               | Defines the data validations that apply to this component.                                            | `CustomValidator<any[] \| undefined>[] \| undefined`                                        | `undefined`                                |
| `value`                       | --                               | Defines the value of the component.                                                                   | `any[] \| undefined`                                                                        | `undefined`                                |
| `width`                       | `width`                          | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                                |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: any[] \| undefined; }>`                                                                                                      |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: any[] \| undefined; }>`                                                                                                      |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: any[] \| undefined; }>`                                                                                                      |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the input

#### Returns

Type: `Promise<void>`



### `getInternalValidityState() => Promise<{ valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }>`

Method to get the validity state.

#### Returns

Type: `Promise<{ valid: boolean; firstError?: string | undefined; nativeErrors?: { [key: string]: string; } | undefined; customErrors?: { [key: string]: string; } | undefined; }>`



### `getItems() => Promise<HTMLBrSelectListItemElement[]>`

Get the items in the select.

#### Returns

Type: `Promise<HTMLBrSelectListItemElement[]>`



### `setInternalValidityState(validity: { valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }) => Promise<void>`

A method to set a custom validity state

#### Parameters

| Name       | Type                                                                                                                                                                    | Description |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `validity` | `{ valid: boolean; firstError?: string \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; customErrors?: { [key: string]: string; } \| undefined; }` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot              | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
|                   | Passes the popover, button, popover-content, select-list and the select-list-item to the single select. |
| `"error-message"` | Enables passing a error message to the internal display.                                                |
| `"hint"`          | Enables passing a custom hint display.                                                                  |
| `"inline-error"`  | Passes a custom error display inline.                                                                   |


----------------------------------------------



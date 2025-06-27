# Tree



<!-- Auto Generated Below -->


## Overview

The Tree component displays child Tree Item components in a nested structure.

## Properties

| Property                      | Attribute                        | Description                                                                             | Type                                                                                        | Default        |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `defaultValue`                | --                               | Defines the default value of the component.                                             | `any[] \| undefined`                                                                        | `undefined`    |
| `disabled`                    | `disabled`                       | Determines if the component is displayed in its disabled state.                         | `boolean \| undefined`                                                                      | `undefined`    |
| `fullHeight`                  | `full-height`                    | Determines if the component expands to fill the available vertical space.               | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`                   | `full-width`                     | Determines if the component expands to fill the available horizontal space.             | `boolean \| undefined`                                                                      | `undefined`    |
| `height`                      | `height`                         | The height in px or percentage. Token variables and calc strings are also supported.    | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `name`                        | `name`                           | Defines the name associated with this component in the context of a form.               | `string`                                                                                    | `undefined`    |
| `roundedCorners`              | `rounded-corners`                | Whether the tree shows in a rounded corner container.                                   | `boolean \| undefined`                                                                      | `true`         |
| `selectingSameValueDeselects` | `selecting-same-value-deselects` | Determines if a previously selected value is deselected when the user selects it again. | `boolean`                                                                                   | `true`         |
| `selection`                   | `selection`                      | Determines the selection allowed by the component.                                      | `"multiple" \| "single" \| boolean`                                                         | `'multiple'`   |
| `size`                        | `size`                           | Defines the size style applied to the component.                                        | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`     |
| `theme`                       | `theme`                          | Defines the theme of the component.                                                     | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `typeahead`                   | `typeahead`                      | Determines whether the component focuses an item as the user types.                     | `boolean \| undefined`                                                                      | `true`         |
| `value`                       | --                               | Defines the value of the component.                                                     | `any[] \| undefined`                                                                        | `undefined`    |
| `width`                       | `width`                          | The width in px or percentage. Token variables and calc strings are also supported.     | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `'100%'`       |


## Events

| Event         | Description                                                                        | Type                                          |
| ------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| `change`      | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: any[] \| undefined; }>` |
| `input`       | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: any[] \| undefined; }>` |
| `valueChange` | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: any[] \| undefined; }>` |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the input

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                        |
| ---- | ---------------------------------- |
|      | Passes the Tree Items to the Tree. |


----------------------------------------------



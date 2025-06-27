# Select list item



<!-- Auto Generated Below -->


## Overview

The List Item component renders one of the options in a list. A user can select a List Item from a list.

## Properties

| Property                 | Attribute                   | Description                                                                          | Type                                                                                        | Default                                  |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `activeKeyboardPropName` | `active-keyboard-prop-name` | Determines the prop to set to true when the element is selected via the keyboard.    | `string`                                                                                    | `'active'`                               |
| `activePropName`         | `active-prop-name`          | Determines the prop to set to true when the element is selected.                     | `string`                                                                                    | `'hover'`                                |
| `disabled`               | `disabled`                  | Determines if the component is displayed in its disabled state.                      | `boolean \| undefined`                                                                      | `undefined`                              |
| `filteredOut`            | `filtered-out`              | Determines if the component is filtered out.                                         | `boolean \| undefined`                                                                      | `undefined`                              |
| `fullHeight`             | `full-height`               | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`                              |
| `fullWidth`              | `full-width`                | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`                              |
| `height`                 | `height`                    | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                              |
| `internalId`             | `internal-id`               | The unique internal ID of the component.                                             | `string`                                                                                    | `` `br-select-item-${selectItemId++}` `` |
| `keyboardSelected`       | `keyboard-selected`         | Determines if the component is shown in its keyboard selected state.                 | `boolean`                                                                                   | `undefined`                              |
| `label`                  | `label`                     | The value of the List Item.                                                          | `string`                                                                                    | `undefined`                              |
| `selected`               | `selected`                  | Determines if the component is shown in its selected state.                          | `boolean`                                                                                   | `undefined`                              |
| `selectedValue`          | --                          | Determines the selected values of the parent component.                              | `any[] \| undefined`                                                                        | `undefined`                              |
| `shape`                  | `shape`                     | Defines the shape style applied to the component.                                    | `"Rectangular"`                                                                             | `'Rectangular'`                          |
| `size`                   | `size`                      | Defines the size style applied to the component.                                     | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                               |
| `theme`                  | `theme`                     | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                           |
| `value`                  | `value`                     | Defines the value of the component.                                                  | `any`                                                                                       | `undefined`                              |
| `width`                  | `width`                     | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                              |


## Events

| Event    | Description                              | Type                           |
| -------- | ---------------------------------------- | ------------------------------ |
| `select` | Event that emits when the popover opens. | `CustomEvent<{ value: any; }>` |


## Slots

| Slot              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
|                   | Passes the label of the List Item.                                 |
| `"item"`          | Passes custom rendered content to the List Item.                   |
| `"left-icon"`     | Passes content on the left side of the List Item.                  |
| `"right-icon"`    | Passes content on the right side of the List Item.                 |
| `"selected-icon"` | Passes content into the selected icon affordance of the List Item. |


----------------------------------------------



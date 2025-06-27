# Tree item



<!-- Auto Generated Below -->


## Overview

The Tree Item component displays an item in a tree component. Reference the Tree documentation for an example.

## Properties

| Property                 | Attribute                   | Description                                                                          | Type                                                                                        | Default         |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------- |
| `activeKeyboardPropName` | `active-keyboard-prop-name` | Determines the prop to set to true when the element is selected via the keyboard.    | `string`                                                                                    | `'active'`      |
| `activePropName`         | `active-prop-name`          | Determines the prop to set to true when the element is selected.                     | `string`                                                                                    | `'hover'`       |
| `disabled`               | `disabled`                  | Determines if the component is displayed in its disabled state.                      | `boolean \| undefined`                                                                      | `undefined`     |
| `fullHeight`             | `full-height`               | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`     |
| `fullWidth`              | `full-width`                | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`     |
| `height`                 | `height`                    | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`     |
| `isOpen`                 | `is-open`                   | Whether the tree item is open                                                        | `boolean`                                                                                   | `false`         |
| `keyboardSelected`       | `keyboard-selected`         | Determines if the component is shown in its keyboard selected state.                 | `boolean`                                                                                   | `undefined`     |
| `selected`               | `selected`                  | Determines if the component is shown in its selected state.                          | `boolean`                                                                                   | `undefined`     |
| `shape`                  | `shape`                     | Defines the shape style applied to the component.                                    | `"Rectangular"`                                                                             | `'Rectangular'` |
| `size`                   | `size`                      | Defines the size style applied to the component.                                     | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`      |
| `theme`                  | `theme`                     | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault`  |
| `value`                  | `value`                     | Defines the value of the component.                                                  | `any`                                                                                       | `undefined`     |
| `width`                  | `width`                     | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `'100%'`        |


## Events

| Event    | Description                              | Type                           |
| -------- | ---------------------------------------- | ------------------------------ |
| `close`  | Emits when the Accordion closes.         | `CustomEvent<void>`            |
| `open`   | Emits when the Accordion opens.          | `CustomEvent<void>`            |
| `select` | Event that emits when the popover opens. | `CustomEvent<{ value: any; }>` |


## Slots

| Slot         | Description                          |
| ------------ | ------------------------------------ |
|              | Passes the label for the Tree Item.  |
| `"children"` | Passes any nested Tree Items.        |
| `"icon"`     | Passes the icon for the Tree Item.   |
| `"right"`    | Passes any actions on the Tree Item. |


----------------------------------------------



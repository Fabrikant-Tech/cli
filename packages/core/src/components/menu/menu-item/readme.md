# Menu item



<!-- Auto Generated Below -->


## Overview

The Menu Item is a child of the Menu component. It displays one of the options in a Menu.

Refer to the Menu component page for an example of how to pass a Menu Item to a Menu.

## Properties

| Property     | Attribute    | Description                                                               | Type                                                                                           | Default         |
| ------------ | ------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------- |
| `active`     | `active`     | Determines if the component is displayed in its active state.             | `boolean \| undefined`                                                                         | `undefined`     |
| `colorType`  | `color-type` | Defines the semantic color applied to the component.                      | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"`                       | `'Neutral'`     |
| `disabled`   | `disabled`   | Determines if the component is displayed in its disabled state.           | `boolean \| undefined`                                                                         | `undefined`     |
| `fillStyle`  | `fill-style` | Defines the fill style applied to the component.                          | `"Ghost" \| "Solid"`                                                                           | `'Ghost'`       |
| `hover`      | `hover`      | Determines if the component is displayed in its hover state.              | `boolean \| undefined`                                                                         | `undefined`     |
| `indentable` | `indentable` | Determines if the component is indented.                                  | `boolean \| undefined`                                                                         | `false`         |
| `selected`   | `selected`   | Determines if the component is selected.                                  | `boolean \| undefined`                                                                         | `false`         |
| `shape`      | `shape`      | Defines the shape style applied to the component.                         | `"Rectangular"`                                                                                | `'Rectangular'` |
| `shortcut`   | `shortcut`   | Determines what key combination will be rendered as a shortcut decorator. | `` `alt+${string}` \| `cmd+${string}` \| `ctrl+${string}` \| `shift+${string}` \| undefined `` | `undefined`     |
| `size`       | `size`       | Defines the size style applied to the component.                          | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                   | `'Normal'`      |
| `theme`      | `theme`      | Defines the theme of the component.                                       | `"Dark" \| "Light"`                                                                            | `ThemeDefault`  |


## Slots

| Slot           | Description              |
| -------------- | ------------------------ |
|                | Passes the button label. |
| `"left-icon"`  | Passes the left icon.    |
| `"right-icon"` | Passes the right icon.   |


----------------------------------------------



# Drawer content



<!-- Auto Generated Below -->


## Overview

The Drawer Content component wraps around the content of drawers to serve as a stable root for conditional rendering.

## Properties

| Property       | Attribute       | Description                                                                              | Type                                                                           | Default        |
| -------------- | --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- |
| `maxHeight`    | `max-height`    | The max height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` `` | `undefined`    |
| `maxWidth`     | `max-width`     | The max width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` `` | `undefined`    |
| `noPadding`    | `no-padding`    | Determines if the component should have padding.                                         | `boolean`                                                                      | `false`        |
| `placement`    | `placement`     | Defines the placement of the component.                                                  | `"bottom" \| "left" \| "right" \| "top"`                                       | `'right'`      |
| `root`         | `root`          | Flags if the component is in the root corresponding parent.                              | `boolean`                                                                      | `false`        |
| `showOverflow` | `show-overflow` | Determines if the overflowing content should be displayed.                               | `boolean`                                                                      | `false`        |
| `theme`        | `theme`         | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                            | `ThemeDefault` |


## Slots

| Slot | Description                           |
| ---- | ------------------------------------- |
|      | Passes content to the Drawer Content. |


----------------------------------------------



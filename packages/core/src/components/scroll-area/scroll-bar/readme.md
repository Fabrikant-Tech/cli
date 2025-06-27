# Scroll bar



<!-- Auto Generated Below -->


## Overview

The Scroll Bar component is used with the scroll area component to enable a user to scroll through content.

## Properties

| Property          | Attribute          | Description                                                      | Type                          | Default        |
| ----------------- | ------------------ | ---------------------------------------------------------------- | ----------------------------- | -------------- |
| `horizontalRatio` | `horizontal-ratio` | Defines the horizontal ratio of the bar relative to the area.    | `number`                      | `undefined`    |
| `left`            | `left`             | Defines the left position relative to the parent.                | `number`                      | `undefined`    |
| `orientation`     | `orientation`      | Defines the orientation of the component relative to its parent. | `"horizontal" \| "vertical"`  | `'vertical'`   |
| `scrollParent`    | --                 | Defines the parent scroll parent the bar is associated with.     | `HTMLDivElement \| undefined` | `undefined`    |
| `theme`           | `theme`            | Defines the theme of the component.                              | `"Dark" \| "Light"`           | `ThemeDefault` |
| `top`             | `top`              | Defines the top position relative to the parent.                 | `number`                      | `undefined`    |
| `verticalRatio`   | `vertical-ratio`   | Defines the vertical ratio of the bar relative to the area.      | `number`                      | `undefined`    |


## Events

| Event          | Description                                              | Type                  |
| -------------- | -------------------------------------------------------- | --------------------- |
| `barDrag`      | Event that triggers when the scroll bar is dragged.      | `CustomEvent<number>` |
| `barDragStart` | Event that triggers when the scroll bar drag is started. | `CustomEvent<void>`   |
| `barDragStop`  | Event that triggers when the scroll bar drag is stopped. | `CustomEvent<void>`   |


----------------------------------------------



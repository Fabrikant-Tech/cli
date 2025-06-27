# Container resize handle



<!-- Auto Generated Below -->


## Overview

The container resize handle component provides a resize affordance in a container resize group component.

## Properties

| Property     | Attribute     | Description                                                                      | Type                                                     | Default        |
| ------------ | ------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------- |
| `direction`  | `direction`   | The direction the content is displayed in the container.                         | `"column" \| "column-reverse" \| "row" \| "row-reverse"` | `'column'`     |
| `largeStep`  | `large-step`  | The numeric difference between values when a user moves the handle via keyboard. | `number`                                                 | `10`           |
| `showHandle` | `show-handle` | Whether the handle is shown on hover and focus or it persists.                   | `"hover" \| boolean`                                     | `true`         |
| `step`       | `step`        | The numeric difference between values.                                           | `number`                                                 | `1`            |
| `theme`      | `theme`       | Defines the theme of the component.                                              | `"Dark" \| "Light"`                                      | `ThemeDefault` |


## Events

| Event           | Description                     | Type                  |
| --------------- | ------------------------------- | --------------------- |
| `resized`       | Emits when the resize happens.. | `CustomEvent<number>` |
| `resizeStarted` | Emits when the resize starts.   | `CustomEvent<void>`   |
| `resizeStopped` | Emits when the resize stops.    | `CustomEvent<void>`   |


## Slots

| Slot | Description                                        |
| ---- | -------------------------------------------------- |
|      | Passes the content to the container resize handle. |


----------------------------------------------



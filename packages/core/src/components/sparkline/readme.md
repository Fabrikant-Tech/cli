# Sparkline



<!-- Auto Generated Below -->


## Overview

The sparkline component is used to display data in a small, simple, and condensed format.

## Properties

| Property      | Attribute      | Description                                                                          | Type                                                                                        | Default                               |
| ------------- | -------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------- |
| `direction`   | `direction`    | Defines the direction of the sparkline.                                              | `"horizontal" \| "vertical"`                                                                | `'vertical'`                          |
| `formatValue` | --             | A function to format the value that appears in the tooltip.                          | `(value: number, index: number \| undefined) => string`                                     | `(value) =>     value.toString()`     |
| `fullHeight`  | `full-height`  | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`                           |
| `fullWidth`   | `full-width`   | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`                           |
| `height`      | `height`       | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                           |
| `internalId`  | `internal-id`  | The unique internal ID of the component.                                             | `string`                                                                                    | `` `br-sparkline-${sparklineId++}` `` |
| `max`         | `max`          | The maximum value of the data points.                                                | `number`                                                                                    | `undefined`                           |
| `min`         | `min`          | The minimum value of the data points.                                                | `number`                                                                                    | `undefined`                           |
| `showGap`     | `show-gap`     | Whether the gap should be displayed between the sparkline data.                      | `boolean`                                                                                   | `false`                               |
| `showTooltip` | `show-tooltip` | Whether a tootlip should be displayed on hover.                                      | `boolean`                                                                                   | `true`                                |
| `stacked`     | `stacked`      | Whether the sparkline is stacked.                                                    | `boolean`                                                                                   | `undefined`                           |
| `theme`       | `theme`        | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                        |
| `type`        | `type`         | Defines the type of sparkline to display.                                            | `"bar" \| "line"`                                                                           | `'bar'`                               |
| `width`       | `width`        | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                           |


## Slots

| Slot | Description                       |
| ---- | --------------------------------- |
|      | Passes the data to the sparkline. |


----------------------------------------------



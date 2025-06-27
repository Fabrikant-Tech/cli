# Simple chart y axis



<!-- Auto Generated Below -->


## Overview

The Y Axis component for the Simple Chart.

## Properties

| Property                 | Attribute                    | Description                                            | Type                                                                                                                                         | Default                                            |
| ------------------------ | ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `axisLabelFormatter`     | --                           | How to format the label.                               | `((value: string \| number, index: number) => string \| ((value: number, index: number, extra: { level: number; }) => string)) \| undefined` | `undefined`                                        |
| `axisPointer`            | `axis-pointer`               | The type of axis pointer.                              | `boolean \| undefined`                                                                                                                       | `false`                                            |
| `data`                   | --                           | The data of the axis.                                  | `` (string \| number \| { value: string \| number; textStyle: { color: `var(--${string})` \| `#${string}` \| BaseRgbaColor; }; })[] ``       | `undefined`                                        |
| `dataPadding`            | `data-padding`               | The padding for the data on each side of the axis.     | `"auto" \| [number, number] \| boolean`                                                                                                      | `'auto'`                                           |
| `max`                    | `max`                        | Determines the maximum value for the component.        | `number \| string \| undefined`                                                                                                              | `this.type === 'category' ? undefined : 'dataMax'` |
| `min`                    | `min`                        |  Determines the minimum value for the component.       | `number \| string \| undefined`                                                                                                              | `this.type === 'category' ? undefined : 'dataMin'` |
| `otherOptions`           | --                           | The options for the axis.                              | `{}`                                                                                                                                         | `undefined`                                        |
| `position`               | `position`                   | The position of the axis.                              | `"left" \| "right"`                                                                                                                          | `'left'`                                           |
| `show`                   | `show`                       | Whether to show the axis.                              | `boolean`                                                                                                                                    | `true`                                             |
| `showAxisLabel`          | `show-axis-label`            | Whether to show the axis label.                        | `boolean \| undefined`                                                                                                                       | `true`                                             |
| `showAxisLine`           | `show-axis-line`             | Whether the axis line should be shown.                 | `boolean`                                                                                                                                    | `true`                                             |
| `showAxisMinorSplitLine` | `show-axis-minor-split-line` | Whether the  axis minor split line should be shown.    | `boolean`                                                                                                                                    | `false`                                            |
| `showAxisSplitLine`      | `show-axis-split-line`       | Whether the axis split line should be shown.           | `boolean`                                                                                                                                    | `true`                                             |
| `showMinorTick`          | `show-minor-tick`            | Whether to show and the number of minor ticks to show. | `boolean \| number`                                                                                                                          | `false`                                            |
| `showSplitArea`          | `show-split-area`            | Whether the split area should be shown.                | `boolean`                                                                                                                                    | `false`                                            |
| `showTick`               | `show-tick`                  | Show tick.                                             | `boolean`                                                                                                                                    | `true`                                             |
| `showTooltip`            | `show-tooltip`               | Whether to show the axis tooltip.                      | `boolean \| undefined`                                                                                                                       | `false`                                            |
| `startValue`             | `start-value`                | The starting value for the axis.                       | `number \| string \| undefined`                                                                                                              | `undefined`                                        |
| `triggerEvent`           | `trigger-event`              | Whether the axis should trigger events.                | `boolean`                                                                                                                                    | `true`                                             |
| `type`                   | `type`                       | The type of the axis.                                  | `"category" \| "log" \| "time" \| "value"`                                                                                                   | `'value'`                                          |


## Events

| Event                   | Description                                       | Type                |
| ----------------------- | ------------------------------------------------- | ------------------- |
| `chartComponentChanged` | Event that is emitted when the series is changed. | `CustomEvent<void>` |


----------------------------------------------



# Simple chart zoom



<!-- Auto Generated Below -->


## Overview

The Zoom component for the Simple Chart.

## Properties

| Property       | Attribute      | Description                                                                                                       | Type                       | Default     |
| -------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------- |
| `endValue`     | `end-value`    | The zoom end value.                                                                                               | `Date \| number \| string` | `undefined` |
| `otherOptions` | --             | The options for the legend.                                                                                       | `{}`                       | `undefined` |
| `realtime`     | `realtime`     | Whether the zoom is realtime.                                                                                     | `boolean`                  | `false`     |
| `show`         | `show`         | Whether the zoom should be shown.                                                                                 | `boolean`                  | `true`      |
| `startValue`   | `start-value`  | The zoom start value.                                                                                             | `Date \| number \| string` | `undefined` |
| `type`         | `type`         | The type of the zoom. Slider displays a range slider, inside enables zooming using the scroll wheel on the chart. | `"inside" \| "slider"`     | `'slider'`  |
| `xAxisIndex`   | `x-axis-index` | The index of the x axis it is attached to.                                                                        | `number`                   | `undefined` |
| `yAxisIndex`   | `y-axis-index` | The index of the y axis it is attached to.                                                                        | `number`                   | `undefined` |


## Events

| Event                   | Description                                       | Type                |
| ----------------------- | ------------------------------------------------- | ------------------- |
| `chartComponentChanged` | Event that is emitted when the series is changed. | `CustomEvent<void>` |


----------------------------------------------



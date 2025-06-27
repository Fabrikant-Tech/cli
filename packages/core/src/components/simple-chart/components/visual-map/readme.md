# Simple chart visual map



<!-- Auto Generated Below -->


## Overview

The Visual map component works in conjunction with a Heatmap series and defines the value and color ranges.

## Properties

| Property       | Attribute      | Description                                                                                        | Type                                     | Default        |
| -------------- | -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------- |
| `color`        | --             | Defines the colors applied to the component.                                                       | `` (`#${string}` \| BaseRgbaColor)[] ``  | `undefined`    |
| `endValue`     | `end-value`    | The visual map start start value. Applied when the slider is enabled.                              | `number`                                 | `undefined`    |
| `max`          | `max`          | Determines the maximum value for the component.                                                    | `"dataMax" \| number`                    | `'dataMax'`    |
| `min`          | `min`          | Determines the minimum value for the component.                                                    | `"dataMin" \| number`                    | `'dataMin'`    |
| `orientation`  | `orientation`  | The orientation of the legend.                                                                     | `"horizontal" \| "vertical"`             | `'horizontal'` |
| `otherOptions` | --             | The options for the legend.                                                                        | `{}`                                     | `undefined`    |
| `position`     | `position`     | The position of the visual map.                                                                    | `"bottom" \| "left" \| "right" \| "top"` | `'bottom'`     |
| `realtime`     | `realtime`     | Whether the visual map selection is realtime.                                                      | `boolean`                                | `false`        |
| `selected`     | --             | The selected state of the legend. Applied when the split number is set and the slider is disabled. | `{ [x: number]: boolean; }`              | `undefined`    |
| `showSlider`   | `show-slider`  | Whether the visaul map should show a range slider.                                                 | `boolean`                                | `undefined`    |
| `splitNumber`  | `split-number` | The number of splits in the data.                                                                  | `number \| undefined`                    | `undefined`    |
| `startValue`   | `start-value`  | The visual map start start value. Applied when the slider is enabled.                              | `number`                                 | `undefined`    |


## Events

| Event                   | Description                                       | Type                |
| ----------------------- | ------------------------------------------------- | ------------------- |
| `chartComponentChanged` | Event that is emitted when the series is changed. | `CustomEvent<void>` |


----------------------------------------------



# Simple chart



<!-- Auto Generated Below -->


## Overview

The Chart component enables the display of data in a visual way.

## Properties

| Property             | Attribute              | Description                                                                          | Type                                                                           | Default        |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------- |
| `fullHeight`         | `full-height`          | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                         | `undefined`    |
| `fullWidth`          | `full-width`           | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                         | `undefined`    |
| `height`             | `height`               | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` `` | `'400px'`      |
| `noPadding`          | `no-padding`           | Removes the padding around the chart grid.                                           | `boolean`                                                                      | `false`        |
| `otherOptions`       | --                     | The chart options configuration object.                                              | `EChartsOption`                                                                | `undefined`    |
| `showTooltip`        | `show-tooltip`         | Whether the tooltip is shown.                                                        | `boolean`                                                                      | `true`         |
| `theme`              | `theme`                | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                            | `ThemeDefault` |
| `tooltipAxisPointer` | `tooltip-axis-pointer` | The tooltip axis pointer.                                                            | `boolean`                                                                      | `true`         |
| `tooltipTrigger`     | `tooltip-trigger`      | The trigger for the tooltip.                                                         | `"axis" \| "item" \| "none"`                                                   | `'item'`       |
| `width`              | `width`                | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` `` | `'100%'`       |


## Events

| Event               | Description                                                         | Type                                                                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click`             | An event that emits when an axis or series is clicked.              | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `dataZoom`          | An event that emits when a data zoom event is triggered.            | `CustomEvent<{ type: "datazoom"; batch?: Omit<ChartDataZoomEventDataDetails, "type">[] \| undefined; } \| { type: "datazoom"; end: number; start: number; startValue?: number \| undefined; endValue?: number \| undefined; } & { [key: string]: unknown; }>` |
| `globalMouseOut`    | An event that emits when the mouse leaves the chart.                | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `legendSelected`    | An event that emits when a data zoom event is triggered.            | `CustomEvent<{ type: "legendselectchanged"; name: string; selected: Record<string, boolean>; }>`                                                                                                                                                              |
| `mouseDown`         | An event that emits when a mouse down happens on an axis or series. | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `mouseMove`         | An event that emits when a mouse move happens on an axis or series. | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `mouseOut`          | An event that emits when a mouse out happens on an axis or series.  | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `mouseOver`         | An event that emits when a mouse over happens on an axis or series. | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `mouseUp`           | An event that emits when a mouse up happens on an axis or series.   | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |
| `visualMapSelected` | An event that emits when the visual map data range is changed.      | `CustomEvent<ECElementEvent>`                                                                                                                                                                                                                                 |


## Methods

### `getChartInstance() => Promise<ECharts | undefined | null>`

A method to retrieve the chart instance.

#### Returns

Type: `Promise<EChartsType | null | undefined>`



### `updateChartInstance() => Promise<ECharts | undefined | null>`

A method to update the chart instance.

#### Returns

Type: `Promise<EChartsType | null | undefined>`




## Slots

| Slot | Description                      |
| ---- | -------------------------------- |
|      | Passes the content to the chart. |


----------------------------------------------



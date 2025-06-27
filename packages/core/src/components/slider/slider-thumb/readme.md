# Slider thumb



<!-- Auto Generated Below -->


## Overview

Used with the slider, the Slider Thumb component is what users move along the slider track to select a value, multiple values, or a range of values, depending on the props.

## Properties

| Property                 | Attribute            | Description                                                       | Type                                                                                                                                                                              | Default                                    |
| ------------------------ | -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `disabled`               | `disabled`           | Determines if the component is displayed in its disabled state.   | `boolean \| undefined`                                                                                                                                                            | `undefined`                                |
| `internalId`             | `internal-id`        | The unique internal ID of the component.                          | `string`                                                                                                                                                                          | `` `br-slider-thumb-${sliderThumbId++}` `` |
| `max` _(required)_       | `max`                | Determines the maximum value for the component.                   | `number`                                                                                                                                                                          | `undefined`                                |
| `min` _(required)_       | `min`                | Determines the minimum value for the component.                   | `number`                                                                                                                                                                          | `undefined`                                |
| `persistentTooltip`      | `persistent-tooltip` | Determines if the tooltips are persistent.                        | `boolean \| undefined`                                                                                                                                                            | `false`                                    |
| `position` _(required)_  | `position`           | Defines the position of the thumb.                                | `"max" \| "min"`                                                                                                                                                                  | `undefined`                                |
| `rangeName` _(required)_ | `range-name`         | Defines the name of the range the component is associated with.   | `string`                                                                                                                                                                          | `undefined`                                |
| `theme`                  | `theme`              | Defines the theme of the component.                               | `"Dark" \| "Light"`                                                                                                                                                               | `ThemeDefault`                             |
| `tooltipPosition`        | `tooltip-position`   | Determines the position of the tooltip relative to the component. | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start" \| undefined` | `undefined`                                |
| `value`                  | `value`              | Defines the value of the component.                               | `number`                                                                                                                                                                          | `undefined`                                |


## Events

| Event         | Description                                                                        | Type                              |
| ------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| `change`      | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: number; }>` |
| `input`       | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: number; }>` |
| `valueChange` | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: number; }>` |


## Methods

### `moveToCoordinate(coordinate: number) => Promise<void>`

A method to move the thumb to a given position.

#### Parameters

| Name         | Type     | Description |
| ------------ | -------- | ----------- |
| `coordinate` | `number` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `"label"` | Passes a custom label for the thumb. |


----------------------------------------------



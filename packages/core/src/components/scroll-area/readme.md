# Scroll area



<!-- Auto Generated Below -->


## Overview

The Scroll Area component handles vertical and horizontal scrolling via a custom scroll bar.

## Properties

| Property               | Attribute                  | Description                                                                                        | Type                                                                                                                    | Default        |
| ---------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------- |
| `allowedScroll`        | `allowed-scroll`           | Determines the type of scrolling allowed.                                                          | `"any" \| "horizontal" \| "vertical" \| boolean`                                                                        | `'vertical'`   |
| `disabled`             | `disabled`                 | Determines if the component is displayed in its disabled state.                                    | `boolean`                                                                                                               | `undefined`    |
| `height`               | `height`                   | The height in px or percentage. Token variables and calc strings are also supported.               | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                             | `undefined`    |
| `overscrollX`          | `overscroll-x`             | Determines what happens when the horizontal boundary of the scroll area is reached when scrolling. | `"auto" \| "contain" \| "none"`                                                                                         | `'contain'`    |
| `overscrollY`          | `overscroll-y`             | Determines what happens when the vertical boundary of the scroll area is reached when scrolling.   | `"auto" \| "contain" \| "none"`                                                                                         | `'contain'`    |
| `scrollSnapType`       | `scroll-snap-type`         | Sets how strictly snap points are enforced on the scroll container in case there is one.           | `"auto" \| "block" \| "both mandatory" \| "both" \| "inline" \| "none" \| "x mandatory" \| "x" \| "y mandatory" \| "y"` | `'none'`       |
| `scrollX`              | `scroll-x`                 | Defines the scroll X position in px.                                                               | `number`                                                                                                                | `undefined`    |
| `scrollY`              | `scroll-y`                 | Defines the scroll y position in px.                                                               | `number`                                                                                                                | `undefined`    |
| `showScrollBarOnHover` | `show-scroll-bar-on-hover` | Determines if the scroll bars should be shown on hover.                                            | `boolean \| undefined`                                                                                                  | `true`         |
| `theme`                | `theme`                    | Defines the theme of the component.                                                                | `"Dark" \| "Light"`                                                                                                     | `ThemeDefault` |
| `width`                | `width`                    | The width in px or percentage. Token variables and calc strings are also supported.                | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                             | `undefined`    |


## Events

| Event         | Description                                                   | Type                                                     |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| `ratioChange` | Event that triggers when the ratio of the scroll bars change. | `CustomEvent<{ vertical: number; horizontal: number; }>` |
| `scroll`      | Event that triggers when scroll happens.                      | `CustomEvent<{ left: number; top: number; }>`            |
| `scrollStart` | Event that triggers when scroll starts.                       | `CustomEvent<{ left: number; top: number; }>`            |
| `scrollStop`  | Event that triggers when scroll stops.                        | `CustomEvent<{ left: number; top: number; }>`            |


## Methods

### `getMaxScroll(direction?: "horizontal" | "vertical") => Promise<number>`

Get the max scroll.

#### Parameters

| Name        | Type                                      | Description |
| ----------- | ----------------------------------------- | ----------- |
| `direction` | `"horizontal" \| "vertical" \| undefined` |             |

#### Returns

Type: `Promise<number>`



### `scrollToCoordinates(coordinate: number, direction?: "horizontal" | "vertical") => Promise<void>`

Method to scroll to coordinates in the scroll area.

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| `coordinate` | `number`                                  |             |
| `direction`  | `"horizontal" \| "vertical" \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `scrollToEnd(direction?: "horizontal" | "vertical") => Promise<void>`

Method to scroll to the end of the scroll area.

#### Parameters

| Name        | Type                                      | Description |
| ----------- | ----------------------------------------- | ----------- |
| `direction` | `"horizontal" \| "vertical" \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `scrollToStart(direction?: "horizontal" | "vertical") => Promise<void>`

Method to scroll to the start of the scroll area.

#### Parameters

| Name        | Type                                      | Description |
| ----------- | ----------------------------------------- | ----------- |
| `direction` | `"horizontal" \| "vertical" \| undefined` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                        |
| ---- | ---------------------------------- |
|      | Passes content to the Scroll Area. |


----------------------------------------------



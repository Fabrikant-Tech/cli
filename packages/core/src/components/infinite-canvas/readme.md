# Infinite canvas



<!-- Auto Generated Below -->


## Overview

The Infinite Canvas component displays elements on an infinitely pannable canvas.

## Properties

| Property                      | Attribute                         | Description                                                                                                                                                                           | Type                            | Default                                          |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------ |
| `allowScrollInNestedElements` | `allow-scroll-in-nested-elements` | Allow scrolling in nested elements.                                                                                                                                                   | `boolean \| undefined`          | `true`                                           |
| `allowWheelPan`               | `allow-wheel-pan`                 | Allow wheel panning.                                                                                                                                                                  | `boolean`                       | `true`                                           |
| `defaultPan`                  | --                                | The default pan coordinates of the canvas.                                                                                                                                            | `[number, number] \| undefined` | `undefined`                                      |
| `defaultZoom`                 | `default-zoom`                    | The default zoom level of the canvas.                                                                                                                                                 | `number \| undefined`           | `undefined`                                      |
| `disabled`                    | `disabled`                        | Whether the canvas actions are disabled.                                                                                                                                              | `"pan" \| "zoom" \| boolean`    | `undefined`                                      |
| `disabledPanAxis`             | `disabled-pan-axis`               | Whether to constrain the pan on any direction.                                                                                                                                        | `"x" \| "y" \| undefined`       | `undefined`                                      |
| `internalId`                  | `internal-id`                     | The unique internal ID of the component.                                                                                                                                              | `string`                        | `` `br-infinite-canvas-${infiniteCanvasId++}` `` |
| `invertWheelPan`              | `invert-wheel-pan`                | Invert wheel pan.                                                                                                                                                                     | `boolean`                       | `false`                                          |
| `invertWheelZoom`             | `invert-wheel-zoom`               | Invert wheel pan.                                                                                                                                                                     | `boolean`                       | `false`                                          |
| `keyboardZoom`                | `keyboard-zoom`                   | Whether keyboard zoom is enabled by using a combination of ctrl or meta key with + and -.                                                                                             | `boolean \| undefined`          | `true`                                           |
| `keyboardZoomSnap`            | `keyboard-zoom-snap`              | The zoom levels that the keyboard zoom spans to. Pass a number to increment in steps equal to the property or pass an array to cycle through the zoom level from smallest to highest. | `number \| number[]`            | `[25, 50, 100, 125, 150, 200, 300, 400, 500]`    |
| `maxZoom`                     | `max-zoom`                        | The max zoom level.                                                                                                                                                                   | `number`                        | `500`                                            |
| `minZoom`                     | `min-zoom`                        | The min zoom level.                                                                                                                                                                   | `number`                        | `25`                                             |
| `moveToVisibilityThreshold`   | `move-to-visibility-threshold`    | How much of the element needs to be visible for the moveToElement method to trigger.                                                                                                  | `number`                        | `50`                                             |
| `panActive`                   | `pan-active`                      | Whether the canvas pan is active.                                                                                                                                                     | `boolean`                       | `undefined`                                      |
| `panLimit`                    | --                                | The pan limit in pixels in all directions around the pan limit origin.                                                                                                                | `[number, number] \| undefined` | `undefined`                                      |
| `sizeLimits`                  | --                                | Defines alternative widht and height limits to replace the window limits.                                                                                                             | `[number, number] \| undefined` | `undefined`                                      |
| `startStopTimeout`            | `start-stop-timeout`              | The timeout duration for the start, stop events.                                                                                                                                      | `number \| undefined`           | `300`                                            |
| `transitionDuration`          | `transition-duration`             | The time it takes for the canvas to animate to a future state after a method has been called.                                                                                         | `number \| undefined`           | `undefined`                                      |
| `xy`                          | --                                | The coordinates of the canvas.                                                                                                                                                        | `[x: number, y: number]`        | `[0, 0]`                                         |
| `zoom`                        | `zoom`                            | The current level of the zoom.                                                                                                                                                        | `number`                        | `100`                                            |


## Events

| Event         | Description                        | Type                                                         |
| ------------- | ---------------------------------- | ------------------------------------------------------------ |
| `panned`      | Emits when the element is panned.  | `CustomEvent<[number, number]>`                              |
| `panStarted`  | Emits when the element pan starts. | `CustomEvent<[number, number]>`                              |
| `panStopped`  | Emits when the element pan stops.  | `CustomEvent<[number, number]>`                              |
| `zoomed`      | Emits when the element is zoomed.  | `CustomEvent<{ zoom: number; xy: [x: number, y: number]; }>` |
| `zoomStarted` | Emits when the element pan starts. | `CustomEvent<{ zoom: number; xy: [x: number, y: number]; }>` |
| `zoomStopped` | Emits when the element pan stops.  | `CustomEvent<{ zoom: number; xy: [x: number, y: number]; }>` |


## Methods

### `moveTo(xy: [number, number], animate?: boolean) => Promise<void>`

Move to a certain coordinate.

#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `xy`      | `[number, number]`     |             |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `moveToElement(element: HTMLElement | string, zoom?: number, animate?: boolean, center?: boolean | "fit") => Promise<void>`

Move to a certain element at a specific zoom level.

#### Parameters

| Name      | Type                            | Description |
| --------- | ------------------------------- | ----------- |
| `element` | `string \| HTMLElement`         |             |
| `zoom`    | `number \| undefined`           |             |
| `animate` | `boolean \| undefined`          |             |
| `center`  | `boolean \| "fit" \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `zoomIn() => Promise<void>`

Zoom in based on the keyboard snap.

#### Returns

Type: `Promise<void>`



### `zoomOut() => Promise<void>`

Zoom out based on the keyboard snap.

#### Returns

Type: `Promise<void>`



### `zoomTo(zoom: number, animate?: boolean) => Promise<void>`

Move to a certain zoom level.

#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `zoom`    | `number`               |             |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `zoomToOrigin(animate?: boolean) => Promise<void>`

Zoom to origin.

#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                       |
| ---- | --------------------------------- |
|      | Passes the content to the canvas. |


----------------------------------------------



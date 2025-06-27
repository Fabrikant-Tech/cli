# Container resize group



<!-- Auto Generated Below -->


## Overview

The container resize component is used to create resizable layout constructs using containers and container resize handles.

## Properties

| Property     | Attribute     | Description                                                                                                           | Type                                                                                        | Default        |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `direction`  | `direction`   | Determines the direction the content is displayed in the component.                                                   | `"column" \| "column-reverse" \| "row" \| "row-reverse"`                                    | `'row'`        |
| `fullHeight` | `full-height` | Determines if the component expands to fill the available vertical space.                                             | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`  | `full-width`  | Determines if the component expands to fill the available horizontal space.                                           | `boolean \| undefined`                                                                      | `undefined`    |
| `height`     | `height`      | The height in px or percentage. Token variables and calc strings are also supported.                                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `maxHeight`  | `max-height`  | The max height in px or percentage. Token variables and calc strings are also supported.                              | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `maxWidth`   | `max-width`   | The max width in px or percentage. Token variables and calc strings are also supported.                               | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `minHeight`  | `min-height`  | The min height in px or percentage. Token variables and calc strings are also supported.                              | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `minWidth`   | `min-width`   | The min width in px or percentage. Token variables and calc strings are also supported.                               | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `shrink`     | `shrink`      | Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent. | `boolean \| undefined`                                                                      | `undefined`    |
| `theme`      | `theme`       | Defines the theme of the component.                                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `width`      | `width`       | The width in px or percentage. Token variables and calc strings are also supported.                                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Events

| Event           | Description                     | Type                                      |
| --------------- | ------------------------------- | ----------------------------------------- |
| `resized`       | Emits when the resize happens.. | `CustomEvent<{ [key: string]: number; }>` |
| `resizeStarted` | Emits when the resize starts.   | `CustomEvent<{ [key: string]: number; }>` |
| `resizeStopped` | Emits when the resize stops.    | `CustomEvent<{ [key: string]: number; }>` |


## Slots

| Slot | Description                          |
| ---- | ------------------------------------ |
|      | Passes the content to the container. |


----------------------------------------------



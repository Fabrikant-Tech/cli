# Capture devices



<!-- Auto Generated Below -->


## Overview

The Capture Device component allows the user to select a media device.

## Properties

| Property         | Attribute         | Description                                                                              | Type                                                                                                             | Default         |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------- |
| `captureElement` | `capture-element` | The capture element that the device selection is attached to.                            | `HTMLBrAudioCaptureElement \| HTMLBrVideoCaptureElement \| HTMLBrVideoCaptureViewElement \| string \| undefined` | `undefined`     |
| `colorType`      | `color-type`      | Defines the semantic color applied to the component.                                     | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"`                                         | `'Neutral'`     |
| `ellipsis`       | `ellipsis`        | Determines if the component displays an ellipsis when the text does not fit the wrapper. | `boolean \| undefined`                                                                                           | `false`         |
| `fillStyle`      | `fill-style`      | Defines the fill style applied to the component.                                         | `"Ghost" \| "Solid"`                                                                                             | `'Ghost'`       |
| `fullWidth`      | `full-width`      | Determines if the component expands to fill the available horizontal space.              | `boolean \| undefined`                                                                                           | `undefined`     |
| `renderAs`       | `render-as`       | Render as list or select.                                                                | `"list" \| "select"`                                                                                             | `'list'`        |
| `shape`          | `shape`           | Defines the shape style applied to the component.                                        | `"Rectangular"`                                                                                                  | `'Rectangular'` |
| `size`           | `size`            | Defines the size style applied to the component.                                         | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                                     | `'Normal'`      |
| `theme`          | `theme`           | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                                                              | `ThemeDefault`  |
| `type`           | `type`            | What type of devices to capture                                                          | `"audio" \| "audio-output" \| "video"`                                                                           | `'audio'`       |
| `value`          | `value`           | The selected device.                                                                     | `string \| undefined`                                                                                            | `undefined`     |
| `width`          | `width`           | The width in px or percentage. Token variables and calc strings are also supported.      | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                      | `undefined`     |


## Events

| Event            | Description                                         | Type                           |
| ---------------- | --------------------------------------------------- | ------------------------------ |
| `deviceSelected` | A event that emits when the selection is completed. | `CustomEvent<MediaDeviceInfo>` |


----------------------------------------------



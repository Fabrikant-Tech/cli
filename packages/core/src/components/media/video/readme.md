# Video capture



<!-- Auto Generated Below -->


## Overview

The Video Capture component enables recording video from the camera.

## Properties

| Property                    | Attribute                      | Description                                                                | Type                                                   | Default     |
| --------------------------- | ------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| `audioInputId`              | `audio-input-id`               | An id for the audio capture device.                                        | `string \| undefined`                                  | `undefined` |
| `clearOnStop`               | `clear-on-stop`                | Whether recording should be cleared on stop.                               | `boolean`                                              | `false`     |
| `connectedVideoCaptureView` | `connected-video-capture-view` | A way to connect the video to a video preview.                             | `HTMLBrVideoCaptureViewElement \| string \| undefined` | `undefined` |
| `connectedVolumePreview`    | `connected-volume-preview`     | A way to connect the video to a volume preview.                            | `HTMLBrVolumePreviewElement \| string \| undefined`    | `undefined` |
| `name`                      | `name`                         | The name attribute ensures this component behaves like an input in a form. | `string \| undefined`                                  | `undefined` |
| `playOnRender`              | `play-on-render`               | Play on render.                                                            | `boolean`                                              | `false`     |
| `recordAudio`               | `record-audio`                 | Determines whether to record audio.                                        | `boolean`                                              | `true`      |
| `videoInputId`              | `video-input-id`               | An id for the video capture device.                                        | `string \| undefined`                                  | `undefined` |


## Events

| Event              | Description                                                | Type                                             |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| `change`           | An event that emits when the video is recorded.            | `CustomEvent<{ video: Blob; videoFile: File; }>` |
| `playingStarted`   | An event that emits when the playing starts.               | `CustomEvent<void>`                              |
| `playingStopped`   | An event that emits when the playing is paused.            | `CustomEvent<void>`                              |
| `recordingPaused`  | An event that emits when the recording is paused.          | `CustomEvent<void>`                              |
| `recordingResumed` | An event that emits when the recording is resumed.         | `CustomEvent<void>`                              |
| `recordingStarted` | An event that emits when the recording starts.             | `CustomEvent<void>`                              |
| `recordingStopped` | An event that emits when the video is recorded.            | `CustomEvent<{ video: Blob; videoFile: File; }>` |
| `streamAvailable`  | An event that emits the video stream.                      | `CustomEvent<MediaStream>`                       |
| `valueChange`      | An event that emits when the video is recorded.            | `CustomEvent<{ video: Blob; videoFile: File; }>` |
| `volumeChanged`    | An event that emits when the amp of the recording changes. | `CustomEvent<{ value: number; }>`                |


## Methods

### `clearRecording() => Promise<void>`

A method to clear the recording.

#### Returns

Type: `Promise<void>`



### `pauseRecording() => Promise<void>`

A method to stop recording.

#### Returns

Type: `Promise<void>`



### `playVideo() => Promise<void>`

A method to play the video.

#### Returns

Type: `Promise<void>`



### `resumeRecording() => Promise<void>`

A method to resume recording.

#### Returns

Type: `Promise<void>`



### `startRecording() => Promise<void>`

A method to start recording.

#### Returns

Type: `Promise<void>`



### `stopRecording() => Promise<void>`

A method to stop recording.

#### Returns

Type: `Promise<void>`



### `stopVideo() => Promise<void>`

A method to stop playing the video.

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                        |
| ---------- | -------------------------------------------------- |
| `"pause"`  | Passes a pause record affordance to the component. |
| `"play"`   | Passes a play affordance to the component.         |
| `"record"` | Passes a record afordance to the component.        |
| `"stop"`   | Passes a stop affordance to the component.         |


----------------------------------------------



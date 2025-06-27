# Audio capture



<!-- Auto Generated Below -->


## Overview

The Audio Capture component enables recording audio from the microphone.

## Properties

| Property       | Attribute        | Description                                                                | Type                  | Default     |
| -------------- | ---------------- | -------------------------------------------------------------------------- | --------------------- | ----------- |
| `audioInputId` | `audio-input-id` | An id for the audio capture device.                                        | `string \| undefined` | `undefined` |
| `name`         | `name`           | The name attribute ensures this component behaves like an input in a form. | `string \| undefined` | `undefined` |


## Events

| Event              | Description                                                | Type                                             |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| `change`           | An event that emits when the audio is recorded.            | `CustomEvent<{ audio: Blob; audioFile: File; }>` |
| `recordingPaused`  | An event that emits when the recording is paused.          | `CustomEvent<void>`                              |
| `recordingResumed` | An event that emits when the recording is resumed.         | `CustomEvent<void>`                              |
| `recordingStarted` | An event that emits when the recording starts.             | `CustomEvent<void>`                              |
| `recordingStopped` | An event that emits when the audio is recorded.            | `CustomEvent<{ audio: Blob; audioFile: File; }>` |
| `valueChange`      | An event that emits when the audio is recorded.            | `CustomEvent<{ audio: Blob; audioFile: File; }>` |
| `volumeChanged`    | An event that emits when the amp of the recording changes. | `CustomEvent<{ value: number; }>`                |


## Methods

### `pauseRecording() => Promise<void>`

A method to stop recording.

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




## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `"pause"` | Passes a pause icon to the component. |
| `"play"`  | Passes a play icon to the component.  |


----------------------------------------------



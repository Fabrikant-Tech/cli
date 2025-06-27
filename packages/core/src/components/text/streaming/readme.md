# Streaming text



<!-- Auto Generated Below -->


## Overview

The streaming text component streams text across the screen.

## Properties

| Property        | Attribute         | Description                                    | Type                 | Default     |
| --------------- | ----------------- | ---------------------------------------------- | -------------------- | ----------- |
| `clearOnFinish` | `clear-on-finish` | Clear on finish.                               | `boolean`            | `false`     |
| `pause`         | `pause`           | What pause to take after displaying the text.  | `number`             | `undefined` |
| `repeat`        | `repeat`          | Whether the streaming text should be repeated. | `boolean`            | `true`      |
| `speed`         | `speed`           | The speed at which to display the text.        | `number`             | `100`       |
| `text`          | `text`            | The text to display.                           | `string \| string[]` | `''`        |


## Events

| Event              | Description                                               | Type                  |
| ------------------ | --------------------------------------------------------- | --------------------- |
| `streamChanged`    | An event that emits whenever the value changes.           | `CustomEvent<string>` |
| `streamingStarted` | An event that emits when the text has started streaming.  | `CustomEvent<void>`   |
| `streamingStopped` | An event that emits when the text has finished streaming. | `CustomEvent<void>`   |


## Slots

| Slot | Description                               |
| ---- | ----------------------------------------- |
|      | The default slot for the text to display. |


----------------------------------------------



# Drag and drop wrapper



<!-- Auto Generated Below -->


## Overview

The drag and drop wrapper enables dragging elements over a drop target.

## Properties

| Property       | Attribute        | Description                                                            | Type                                       | Default     |
| -------------- | ---------------- | ---------------------------------------------------------------------- | ------------------------------------------ | ----------- |
| `dragData`     | `drag-data`      | The data attached to the element that is being dragged.                | `any`                                      | `undefined` |
| `dropTargetId` | `drop-target-id` | Determines the drop target id that that the element can be dropped on. | `HTMLBrDragAndDropTargetElement \| string` | `undefined` |


## Events

| Event       | Description                                      | Type                                                                 |
| ----------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `drag`      | Event that triggers when the element is dragged. | `CustomEvent<{ x: number; y: number; dragState: DragAndDropData; }>` |
| `dragStart` | Event that triggers when drag starts.            | `CustomEvent<{ x: number; y: number; dragState: DragAndDropData; }>` |
| `dragStop`  | Event that triggers when drag ends.              | `CustomEvent<void>`                                                  |


## Slots

| Slot           | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
|                | Passes the element to be dragged.                                                          |
| `"drag-ghost"` | Passes the element to follow the cursor when dragging is active.                           |
| `"ghost"`      | Passes the element to be displayed in place of the draggable element once dragging starts. |


----------------------------------------------



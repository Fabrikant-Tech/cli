# Drag and drop target



<!-- Auto Generated Below -->


## Overview

The drag and drop target accepts drag and drop wrapper items.

## Properties

| Property       | Attribute        | Description                                                                              | Type      | Default     |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`       | `active`         | Determines if the drop target is shown in its active state.                              | `boolean` | `undefined` |
| `dropTargetId` | `drop-target-id` | Determines the drop target id that controls which elements can be dropped on the target. | `string`  | `undefined` |


## Events

| Event       | Description                                                         | Type                          |
| ----------- | ------------------------------------------------------------------- | ----------------------------- |
| `dragEnter` | Event that emits when the dragged item enters a valid drop target.  | `CustomEvent<{ data: any; }>` |
| `dragLeave` | Event that emits when the dragged item leaves a valid drop target.  | `CustomEvent<{ data: any; }>` |
| `dragOver`  | Event that emits when the dragged item is over a valid drop target. | `CustomEvent<{ data: any; }>` |
| `drop`      | Event that emits when something is dropped over the target.         | `CustomEvent<{ data: any; }>` |


## Slots

| Slot | Description                             |
| ---- | --------------------------------------- |
|      | Passes the element for the drop target. |


----------------------------------------------



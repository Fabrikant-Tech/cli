# Breakpoint sensor



<!-- Auto Generated Below -->


## Overview

The Breakpoint Sensor helps manage different screen resolutions and devices.

## Properties

| Property                   | Attribute | Description                                                   | Type                     | Default     |
| -------------------------- | --------- | ------------------------------------------------------------- | ------------------------ | ----------- |
| `breakpoints` _(required)_ | --        | Determines the list of breakpoints the component responds to. | `BreakpointSensorStep[]` | `undefined` |


## Events

| Event               | Description                         | Type                  |
| ------------------- | ----------------------------------- | --------------------- |
| `breakpointMatched` | Emits when a breakpoint is matched. | `CustomEvent<string>` |


## Methods

### `getActiveBreakPointName() => Promise<string>`

Method to get the active breakpoint.

#### Returns

Type: `Promise<string>`




----------------------------------------------



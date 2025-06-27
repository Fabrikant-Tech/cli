# Sidebar item



<!-- Auto Generated Below -->


## Overview

The Sidebar item component displays a single item in the sidebar.

## Properties

| Property       | Attribute       | Description                                          | Type                                                                     | Default        |
| -------------- | --------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| `active`       | `active`        | Defines whether the sidebar item is active or not    | `boolean`                                                                | `false`        |
| `colorType`    | `color-type`    | Defines the semantic color applied to the component. | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"` | `'Primary'`    |
| `minimized`    | `minimized`     | Defines whether the sidebar item is minimized or not | `boolean`                                                                | `false`        |
| `showTooltip`  | `show-tooltip`  | Whether a tooltip will be shown in its closed state. | `boolean \| undefined`                                                   | `undefined`    |
| `theme`        | `theme`         | Defines the theme of the component.                  | `"Dark" \| "Light"`                                                      | `ThemeDefault` |
| `tooltipLabel` | `tooltip-label` | What tooltip label to display.                       | `string \| undefined`                                                    | `undefined`    |


## Events

| Event   | Description                                                          | Type                                                 |
| ------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| `hover` | Event emitted when the sidebar item is hovered or hover is disabled. | `CustomEvent<HTMLBrSidebarItemElement \| undefined>` |


## Slots

| Slot           | Description                    |
| -------------- | ------------------------------ |
|                | Passes the sidebar item label. |
| `"left-icon"`  | Passes the left icon.          |
| `"right-icon"` | Passes the right icon.         |


----------------------------------------------



# Wizard item



<!-- Auto Generated Below -->


## Overview

The Wizard Item displays a step in a Wizard flow.

## Properties

| Property          | Attribute          | Description                                                         | Type                         | Default        |
| ----------------- | ------------------ | ------------------------------------------------------------------- | ---------------------------- | -------------- |
| `active`          | `active`           | Determines if the component is displayed in its active state.       | `boolean`                    | `undefined`    |
| `direction`       | `direction`        | Determines the direction the content is displayed in the component. | `"horizontal" \| "vertical"` | `'horizontal'` |
| `disabled`        | `disabled`         | Determines if the component is displayed in its disabled state.     | `boolean`                    | `undefined`    |
| `finished`        | `finished`         | Determines if the component is displayed in its finished state.     | `boolean`                    | `undefined`    |
| `parentDirection` | `parent-direction` | Stores the parent component direction.                              | `"horizontal" \| "vertical"` | `undefined`    |
| `size`            | `size`             | Defines the size style applied to the component.                    | `"Large" \| "Normal"`        | `'Normal'`     |
| `theme`           | `theme`            | Defines the theme of the component.                                 | `"Dark" \| "Light"`          | `ThemeDefault` |


## Slots

| Slot              | Description                            |
| ----------------- | -------------------------------------- |
|                   | Passes the wizard item label.          |
| `"finished-icon"` | Passes the finished icon.              |
| `"icon"`          | Passes the content for the whole icon. |


----------------------------------------------



# Link



<!-- Auto Generated Below -->


## Overview

The Link component enables users to navigate to a destination URL on click.

## Properties

| Property            | Attribute             | Description                                                     | Type                                                                     | Default        |
| ------------------- | --------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| `colorType`         | `color-type`          | Defines the semantic color applied to the component.            | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"` | `'Primary'`    |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state. | `boolean \| undefined`                                                   | `undefined`    |
| `focusable`         | `focusable`           | Determines whether the component should be focusable.           | `boolean \| undefined`                                                   | `true`         |
| `target`            | `target`              | Determines where the component opens the URL it navigates to.   | `"_blank" \| "_parent" \| "_self" \| "_top" \| undefined`                | `'_self'`      |
| `theme`             | `theme`               | Defines the theme of the component.                             | `"Dark" \| "Light"`                                                      | `ThemeDefault` |
| `url`               | `url`                 | Defines the URL the component navigates to.                     | `string \| undefined`                                                    | `undefined`    |
| `wrapAroundContent` | `wrap-around-content` | Defines whether the link wraps around the content.              | `boolean`                                                                | `false`        |


## Slots

| Slot | Description              |
| ---- | ------------------------ |
|      | Passes the link content. |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"href"` |             |


----------------------------------------------



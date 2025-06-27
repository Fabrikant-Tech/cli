# Table header



<!-- Auto Generated Below -->


## Overview

The table header component is a child of the table row component and is used to define the cells within the header.

## Properties

| Property        | Attribute        | Description                                                                              | Type                                                                                        | Default        |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `colSpan`       | `col-span`       | Defines the how many columns the component spans.                                        | `number`                                                                                    | `undefined`    |
| `columnId`      | `column-id`      | Defines the data id / the column this is associated with.                                | `string`                                                                                    | `undefined`    |
| `ellipsis`      | `ellipsis`       | Determines if the component displays an ellipsis when the text does not fit the wrapper. | `boolean`                                                                                   | `false`        |
| `noPadding`     | `no-padding`     | Defines whether the cell has any padding.                                                | `boolean`                                                                                   | `false`        |
| `rowSpan`       | `row-span`       | Defines the how many rows the component spans.                                           | `number`                                                                                    | `undefined`    |
| `sortDirection` | `sort-direction` | Defines the sort direction displayed in the column.                                      | `"asc" \| "desc" \| undefined`                                                              | `undefined`    |
| `sortable`      | `sortable`       | Determines if a sorting affordance is displayed.                                         | `boolean`                                                                                   | `true`         |
| `textAlign`     | `text-align`     | Defines how the text is aligned within the component.                                    | `"center" \| "justify" \| "left" \| "right"`                                                | `'left'`       |
| `theme`         | `theme`          | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `visible`       | `visible`        | Determines if the column is visible.                                                     | `boolean \| undefined`                                                                      | `undefined`    |
| `width`         | `width`          | The width in px or percentage. Token variables and calc strings are also supported.      | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Slots

| Slot | Description                     |
| ---- | ------------------------------- |
|      | Passes the content to the cell. |


----------------------------------------------



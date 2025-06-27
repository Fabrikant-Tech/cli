# Table

<!-- Auto Generated Below -->


## Overview

The table displays simple data compositionally.

## Usage

### Key example

```jsx live
<BrTable>
  <BrTable width="100%">
    <BrTableRow slot="header">
      <BrTableHeader columnId="column-1" key={0}>
        <span>Header 1</span>
      </BrTableHeader>
      <BrTableHeader columnId="column-2" key={1}>
        <span>Header 2</span>
      </BrTableHeader>
      <BrTableHeader columnId="column-3" key={2}>
        <span>Header 3</span>
      </BrTableHeader>
      <BrTableHeader columnId="column-4" key={3}>
        <span>Header 4</span>
      </BrTableHeader>
    </BrTableRow>
    <BrTableRow key={0}>
      <BrTableCell columnId="column-1" key={0}>
        <span>Cell 1-1</span>
      </BrTableCell>
      <BrTableCell columnId="column-2" key={1}>
        <span>Cell 1-2</span>
      </BrTableCell>
      <BrTableCell columnId="column-3" key={2}>
        <span>Cell 1-3</span>
      </BrTableCell>
      <BrTableCell columnId="column-4" key={3}>
        <span>Cell 1-4</span>
      </BrTableCell>
    </BrTableRow>
    <BrTableRow key={1}>
      <BrTableCell columnId="column-1" key={0}>
        <span>Cell 2-1</span>
      </BrTableCell>
      <BrTableCell columnId="column-2" key={1}>
        <span>Cell 2-2</span>
      </BrTableCell>
      <BrTableCell columnId="column-3" key={2}>
        <span>Cell 2-3</span>
      </BrTableCell>
      <BrTableCell columnId="column-4" key={3}>
        <span>Cell 2-4</span>
      </BrTableCell>
    </BrTableRow>
    <BrTableRow key={2}>
      <BrTableCell columnId="column-1" key={0}>
        <span>Cell 3-1</span>
      </BrTableCell>
      <BrTableCell columnId="column-2" key={1}>
        <span>Cell 3-2</span>
      </BrTableCell>
      <BrTableCell columnId="column-3" key={2}>
        <span>Cell 3-3</span>
      </BrTableCell>
      <BrTableCell columnId="column-4" key={3}>
        <span>Cell 3-4</span>
      </BrTableCell>
    </BrTableRow>
    <BrTableRow key={3}>
      <BrTableCell columnId="column-1" key={0}>
        <span>Cell 4-1</span>
      </BrTableCell>
      <BrTableCell columnId="column-2" key={1}>
        <span>Cell 4-2</span>
      </BrTableCell>
      <BrTableCell columnId="column-3" key={2}>
        <span>Cell 4-3</span>
      </BrTableCell>
      <BrTableCell columnId="column-4" key={3}>
        <span>Cell 4-4</span>
      </BrTableCell>
    </BrTableRow>
  </BrTable>
</BrTable>
```



## Properties

| Property               | Attribute         | Description                                                                                        | Type                                                                                                                  | Default        |
| ---------------------- | ----------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------- |
| `border`               | `border`          | Determines which borders are displayed in the component.                                           | `"all" \| "all-no-edge" \| "edge" \| "horizontal" \| "none" \| "vertical"`                                            | `'all'`        |
| `checkered`            | `checkered`       | Determines whether the rows are checkered.                                                         | `boolean \| undefined`                                                                                                | `true`         |
| `fullHeight`           | `full-height`     | Determines if the component expands to fill the available vertical space.                          | `boolean \| undefined`                                                                                                | `undefined`    |
| `fullWidth`            | `full-width`      | Determines if the component expands to fill the available horizontal space.                        | `boolean \| undefined`                                                                                                | `undefined`    |
| `height`               | `height`          | The height in px or percentage. Token variables and calc strings are also supported.               | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                           | `undefined`    |
| `hiddenColumnIds`      | --                | Determines the hidden columns.                                                                     | `string[] \| undefined`                                                                                               | `undefined`    |
| `highlightedColumnId`  | --                | Highlighted column.                                                                                | `string[] \| undefined`                                                                                               | `undefined`    |
| `hoverDisplay`         | `hover-display`   | Determines which elements are highlighted when hovering over the table.                            | `"all" \| "cell" \| "column" \| "none" \| "row" \| undefined`                                                         | `'row'`        |
| `leftPinnedColumnIds`  | --                | Determines the last columnId that is pinned on each header row on the left of the table.           | `string[] \| undefined`                                                                                               | `undefined`    |
| `overscrollX`          | `overscroll-x`    | Determines what happens when the horizontal boundary of the scroll area is reached when scrolling. | `"auto" \| "contain" \| "none"`                                                                                       | `'contain'`    |
| `overscrollY`          | `overscroll-y`    | Determines what happens when the vertical boundary of the scroll area is reached when scrolling.   | `"auto" \| "contain" \| "none"`                                                                                       | `'contain'`    |
| `rightPinnedColumnIds` | --                | Determines the last columnId that is pinned on each header row on the right of the table.          | `string[] \| undefined`                                                                                               | `undefined`    |
| `roundedCorners`       | `rounded-corners` | Determines if the component is displayed with rounded corners.                                     | `boolean \| undefined`                                                                                                | `true`         |
| `size`                 | `size`            | Defines the size style applied to the component.                                                   | `"Large" \| "Normal" \| "Small"`                                                                                      | `'Normal'`     |
| `sortFunction`         | --                | Passes a custom sort function.                                                                     | `((a: string \| number, b: string \| number, sortingDirection: "desc" \| "asc" \| undefined) => number) \| undefined` | `undefined`    |
| `sortMode`             | `sort-mode`       | Determines the sorting mode.                                                                       | `"back-end" \| "front-end"`                                                                                           | `'front-end'`  |
| `theme`                | `theme`           | Defines the theme of the component.                                                                | `"Dark" \| "Light"`                                                                                                   | `ThemeDefault` |
| `width`                | `width`           | The width in px or percentage. Token variables and calc strings are also supported.                | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``                           | `undefined`    |


## Events

| Event         | Description                                    | Type                                                                                       |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `scroll`      | Event that triggers when scroll happens.       | `CustomEvent<{ left: number; top: number; }>`                                              |
| `scrollStart` | Event that triggers when scroll starts.        | `CustomEvent<{ left: number; top: number; }>`                                              |
| `scrollStop`  | Event that triggers when scroll stops.         | `CustomEvent<{ left: number; top: number; }>`                                              |
| `selectRow`   | Event that emits when a table row is selected. | `CustomEvent<{ selection: HTMLBrTableRowElement[]; }>`                                     |
| `sort`        | Event that emits when the sorting changes.     | `CustomEvent<{ columnId: string \| undefined; direction: "desc" \| "asc" \| undefined; }>` |


## Methods

### `clearSelection() => Promise<void>`

A method to clear the selection of all rows.

#### Returns

Type: `Promise<void>`



### `sortTable(columnId: string, sortingDirection?: "asc" | "desc") => Promise<void>`

A method to sort the table given a column id.

#### Parameters

| Name               | Type                           | Description |
| ------------------ | ------------------------------ | ----------- |
| `columnId`         | `string`                       |             |
| `sortingDirection` | `"desc" \| "asc" \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `toggleSelection() => Promise<void>`

A method to toggle the selection of all rows.

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                             |
| ---------- | --------------------------------------- |
|            | Passes the rows to the table.           |
| `"footer"` | Passes the footer content to the table. |
| `"header"` | Passes the rows to the table header.    |


----------------------------------------------



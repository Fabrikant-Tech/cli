# Overflow wrapper



<!-- Auto Generated Below -->


## Overview

The Overflow component organizes elements in a given amount of space. Elements that don't fit in the given space are hidden behind a popover.

## Properties

| Property                 | Attribute                  | Description                                                            | Type                                     | Default        |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------- | -------------- |
| `direction`              | `direction`                | Determines the direction the content is displayed in the component.    | `"horizontal" \| "vertical"`             | `'horizontal'` |
| `order`                  | `order`                    | Determines the order of the elements in the component.                 | `"backward" \| "forward"`                | `'backward'`   |
| `overflowButtonPosition` | `overflow-button-position` | Determines where the ellipsis is displayed in the component.           | `"edge-end" \| "edge-start" \| "middle"` | `'edge-start'` |
| `overflowItemProps`      | --                         | Defines a list of properties to apply to the items that are overflown. | `undefined \| { [key: string]: any; }`   | `{}`           |
| `theme`                  | `theme`                    | Defines the theme of the component.                                    | `"Dark" \| "Light"`                      | `ThemeDefault` |
| `visibleItemProps`       | --                         | Defines a list of properties to apply to the items that are visible.   | `undefined \| { [key: string]: any; }`   | `{}`           |


## Slots

| Slot                | Description                                          |
| ------------------- | ---------------------------------------------------- |
|                     | Passes the content to the overflow.                  |
| `"left-decorator"`  | Passes the content to the left side of the content.  |
| `"overflow-footer"` | Passes the content to the overflow footer.           |
| `"overflow-header"` | Passes the content to the overflow header.           |
| `"right-decorator"` | Passes the content to the right side of the content. |


----------------------------------------------



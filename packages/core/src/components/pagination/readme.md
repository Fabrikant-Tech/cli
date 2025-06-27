# Pagination



<!-- Auto Generated Below -->


## Overview

The Pagination component allows designers and developers to display a series of affordances that represent pages of content. The component renders a dynamic number of affordances based on the total number of pages. Elements that don't fit in will be added to an overflow button that displays excluded elements in a popover.

## Properties

| Property                    | Attribute                       | Description                                    | Type                | Default              |
| --------------------------- | ------------------------------- | ---------------------------------------------- | ------------------- | -------------------- |
| `activePage`                | `active-page`                   | Defines the active page.                       | `number`            | `undefined`          |
| `activeResultsPerPage`      | `active-results-per-page`       | Defines the active number of results per page. | `number`            | `10`                 |
| `pages`                     | `pages`                         | Defines the number of pages to display.        | `number`            | `undefined`          |
| `resultsPerPageOptions`     | --                              | Defines the list of possible results per page. | `number[]`          | `[10, 50, 100, 200]` |
| `showResultsPerPageOptions` | `show-results-per-page-options` | Show results per page options.                 | `boolean`           | `true`               |
| `theme`                     | `theme`                         | Defines the theme of the component.            | `"Dark" \| "Light"` | `ThemeDefault`       |


## Events

| Event                        | Description                                                   | Type                  |
| ---------------------------- | ------------------------------------------------------------- | --------------------- |
| `activePageChange`           | An event that emits when the active page changes.             | `CustomEvent<number>` |
| `activeResultsPerPageChange` | An event that emits when the active results per page changes. | `CustomEvent<number>` |


----------------------------------------------



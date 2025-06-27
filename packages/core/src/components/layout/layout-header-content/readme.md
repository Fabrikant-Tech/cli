# Layout header content



<!-- Auto Generated Below -->


## Overview

The Sidebar Content component enables the display of a sidebar and content element.

## Properties

| Property               | Attribute                | Description                                                                          | Type                                                                                        | Default        |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| `contentAllowedScroll` | `content-allowed-scroll` | Determines what type of scrolling is allowed in the content part of the component.   | `"any" \| "horizontal" \| "vertical" \| boolean`                                            | `'vertical'`   |
| `direction`            | `direction`              | Determines the direction of the header.                                              | `"bottom" \| "top"`                                                                         | `'top'`        |
| `fullHeight`           | `full-height`            | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`            | `full-width`             | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`    |
| `headerAllowedScroll`  | `header-allowed-scroll`  | Determines what type of scrolling is allowed in the header part of the component.    | `"any" \| "horizontal" \| "vertical" \| boolean`                                            | `false`        |
| `height`               | `height`                 | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `'100%'`       |
| `theme`                | `theme`                  | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `width`                | `width`                  | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `'100%'`       |


## Events

| Event         | Description                              | Type                                          |
| ------------- | ---------------------------------------- | --------------------------------------------- |
| `scroll`      | Event that triggers when scroll happens. | `CustomEvent<{ left: number; top: number; }>` |
| `scrollStart` | Event that triggers when scroll starts.  | `CustomEvent<{ left: number; top: number; }>` |
| `scrollStop`  | Event that triggers when scroll stops.   | `CustomEvent<{ left: number; top: number; }>` |


## Slots

| Slot        | Description                 |
| ----------- | --------------------------- |
| `"content"` | Passes the content.         |
| `"header"`  | Passes the sidebar content. |


----------------------------------------------



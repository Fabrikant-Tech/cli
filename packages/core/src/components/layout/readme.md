# Layout



<!-- Auto Generated Below -->


## Overview

The Layout component enables the creation of layout structures.

## Properties

| Property             | Attribute             | Description                                                                                                           | Type                                                                                               | Default        |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------- |
| `allowedScroll`      | `allowed-scroll`      | Determines the type of scrolling allowed.                                                                             | `"any" \| "horizontal" \| "vertical" \| boolean`                                                   | `'vertical'`   |
| `direction`          | `direction`           | Determines the direction the content is displayed in the component.                                                   | `"column" \| "column-reverse" \| "row" \| "row-reverse"`                                           | `'column'`     |
| `directionAlignment` | `direction-alignment` | Determines the component's direction alignment.                                                                       | `"center" \| "end" \| "space-around" \| "space-between" \| "space-evenly" \| "start" \| "stretch"` | `'start'`      |
| `fullHeight`         | `full-height`         | Determines if the component expands to fill the available vertical space.                                             | `boolean \| undefined`                                                                             | `undefined`    |
| `fullWidth`          | `full-width`          | Determines if the component expands to fill the available horizontal space.                                           | `boolean \| undefined`                                                                             | `undefined`    |
| `height`             | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``        | `'100%'`       |
| `secondaryAlignment` | `secondary-alignment` | Determines the component's secondary alignment.                                                                       | `"center" \| "end" \| "space-around" \| "space-between" \| "space-evenly" \| "start" \| "stretch"` | `'stretch'`    |
| `shrink`             | `shrink`              | Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent. | `boolean \| undefined`                                                                             | `undefined`    |
| `theme`              | `theme`               | Defines the theme of the component.                                                                                   | `"Dark" \| "Light"`                                                                                | `ThemeDefault` |
| `width`              | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined ``        | `undefined`    |
| `wrap`               | `wrap`                | Determines whether the component allows the content to wrap.                                                          | `"reverse" \| boolean \| undefined`                                                                | `undefined`    |


## Slots

| Slot | Description                |
| ---- | -------------------------- |
|      | Passes the layout content. |


----------------------------------------------



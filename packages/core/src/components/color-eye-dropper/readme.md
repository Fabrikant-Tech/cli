# Color eye dropper



<!-- Auto Generated Below -->


## Overview

The Color Eye Dropper component allows the user to select a color from the screen using the browser's native eye dropper tool.

## Properties

| Property    | Attribute    | Description                                                     | Type                                                                     | Default         |
| ----------- | ------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------- |
| `colorType` | `color-type` | Defines the semantic color applied to the component.            | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"` | `'Primary'`     |
| `content`   | `content`    | The avatar content as a first last name, url or single string.  | `` `${string} ${string}` \| `url(${string})` \| undefined ``             | `undefined`     |
| `disabled`  | `disabled`   | Determines if the component is displayed in its disabled state. | `boolean \| undefined`                                                   | `undefined`     |
| `fillStyle` | `fill-style` | Defines the fill style applied to the component.                | `"Ghost" \| "Solid"`                                                     | `'Solid'`       |
| `shape`     | `shape`      | Defines the shape style applied to the component.               | `"Rectangular"`                                                          | `'Rectangular'` |
| `size`      | `size`       | Defines the size style applied to the component.                | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                             | `'Normal'`      |
| `theme`     | `theme`      | Defines the theme of the component.                             | `"Dark" \| "Light"`                                                      | `ThemeDefault`  |


## Events

| Event  | Description                                   | Type                                |
| ------ | --------------------------------------------- | ----------------------------------- |
| `pick` | Emits when the hex and RGB color code change. | `CustomEvent<{ sRGBHex: string; }>` |


----------------------------------------------



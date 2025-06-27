# File preview



<!-- Auto Generated Below -->


## Overview

The File Preview component enables previewing a file to display in t.

## Properties

| Property          | Attribute          | Description                                         | Type                                         | Default        |
| ----------------- | ------------------ | --------------------------------------------------- | -------------------------------------------- | -------------- |
| `file`            | --                 | Determines the file to be previewed.                | `File \| undefined`                          | `undefined`    |
| `previewDuration` | `preview-duration` | Determines the preview duration for playable media. | `number`                                     | `5000`         |
| `size`            | `size`             | Defines the size style applied to the component.    | `"Large" \| "Normal" \| "Small" \| "Xsmall"` | `'Normal'`     |
| `theme`           | `theme`            | Defines the theme of the component.                 | `"Dark" \| "Light"`                          | `ThemeDefault` |


## Slots

| Slot                                | Description                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `"browse-button"`                   |                                                                                     |
| `"browse-button-label"`             |                                                                                     |
| `"error-message"`                   | Enables passing a error message to the internal display.                            |
| `"icon"`                            | Passes an icon to the component.                                                    |
| `"inline-error"`                    | Passes a custom error display inline.                                               |
| `"tooltip-error"`                   | Passes a custom error display as a tooltip.                                         |
| `"{{file-name}}-file-item-content"` | Dynamic slot name that allows passing custom rendered content to each file element. |
| `"{{file-name}}-file-item-preview"` | Dynamic slot name that allows passing a custom preview to each file.                |


----------------------------------------------



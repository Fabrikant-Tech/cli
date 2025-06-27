# Code Editor

<!-- Auto Generated Below -->


## Overview

The Code Editor component is used to display and edit code snippets.

## Properties

| Property     | Attribute     | Description                                                                          | Type                                                                                        | Default        |
| ------------ | ------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| `fullHeight` | `full-height` | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`  | `full-width`  | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`    |
| `height`     | `height`      | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `theme`      | `theme`       | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `value`      | `value`       | Defines the value of the component.                                                  | `string \| undefined`                                                                       | `undefined`    |
| `width`      | `width`       | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Events

| Event        | Description                             | Type                  |
| ------------ | --------------------------------------- | --------------------- |
| `codeChange` | Event emitted when the content changes. | `CustomEvent<string>` |


## Methods

### `getEditorView() => Promise<EditorView | undefined>`

Method that returns the Editor view.

#### Returns

Type: `Promise<EditorView | undefined>`




----------------------------------------------



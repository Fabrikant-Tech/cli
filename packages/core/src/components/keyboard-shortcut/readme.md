# Keyboard shortcut



<!-- Auto Generated Below -->


## Overview

A listener that captures Keyboard Shortcuts if any wrapped element is focused.

## Properties

| Property            | Attribute           | Description                                                                                                         | Type                                                                                                                                                                                                              | Default                                              |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `highlightPosition` | --                  | Determines where the highlight is positioned relative to the target.                                                | `["top" \| "bottom" \| undefined, "right" \| "left" \| undefined]`                                                                                                                                                | `[     'bottom',     'right',   ]`                   |
| `highlightShortcut` | --                  | Determines what shortcut is used to highlight the targets.                                                          | `{ key?: string \| undefined; modifierKey?: ModifierKey[] \| undefined; }`                                                                                                                                        | `{     key: '/',   }`                                |
| `highlightTargets`  | `highlight-targets` | Determines whether the targets of the shortcuts are highlighted.                                                    | `boolean`                                                                                                                                                                                                         | `true`                                               |
| `internalId`        | `internal-id`       | The unique internal ID of the component.                                                                            | `string`                                                                                                                                                                                                          | `` `br-keyboard-shortcut-${keyboardShortcutId++}` `` |
| `keyboardShortcuts` | --                  | The keyboard shortcuts to listen to.                                                                                | `{ key: string; description: string; onTrigger: () => void; preventDefault?: boolean \| undefined; modifierKey?: ModifierKey[] \| undefined; target?: string \| HTMLElement \| Element \| null \| undefined; }[]` | `undefined`                                          |
| `listenTarget`      | `listen-target`     | Determines where the shortcuts are listened to. Self listens to the component itself, window listens to the window. | `"self" \| "window"`                                                                                                                                                                                              | `'self'`                                             |
| `theme`             | `theme`             | Defines the theme of the component.                                                                                 | `"Dark" \| "Light"`                                                                                                                                                                                               | `ThemeDefault`                                       |


----------------------------------------------



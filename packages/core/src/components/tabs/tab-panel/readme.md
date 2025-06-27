# Tab panel



<!-- Auto Generated Below -->


## Overview

The Tab Panel is the child component of the Tab Content. It contains the content for each Tab Item in the Tab List.

## Properties

| Property     | Attribute     | Description                                                                          | Type                                                                                        | Default                         |
| ------------ | ------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------- |
| `active`     | `active`      | Determines if the component is displayed in its active state.                        | `boolean`                                                                                   | `false`                         |
| `fullHeight` | `full-height` | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`                     |
| `fullWidth`  | `full-width`  | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `true`                          |
| `height`     | `height`      | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                     |
| `internalId` | `internal-id` | The unique internal ID of the component.                                             | `string`                                                                                    | `` `br-tab-panel-${tabId++}` `` |
| `theme`      | `theme`       | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                  |
| `value`      | `value`       | Defines the value of the component.                                                  | `string \| undefined`                                                                       | `undefined`                     |
| `width`      | `width`       | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                     |


## Slots

| Slot | Description                          |
| ---- | ------------------------------------ |
|      | Passes the content of the Tab Panel. |


----------------------------------------------



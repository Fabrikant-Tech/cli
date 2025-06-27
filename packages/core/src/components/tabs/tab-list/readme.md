# Tab list



<!-- Auto Generated Below -->


## Overview

The Tab List displays the Tab Items that users can select. It is the parent component of the Tab Item.

## Properties

| Property       | Attribute        | Description                                                                          | Type                                                                                        | Default        |
| -------------- | ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| `defaultValue` | `default-value`  | Defines the default value of the component.                                          | `string \| undefined`                                                                       | `undefined`    |
| `direction`    | `direction`      | Determines the direction the content is displayed in the component.                  | `"horizontal" \| "vertical"`                                                                | `'horizontal'` |
| `fullHeight`   | `full-height`    | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`    | `full-width`     | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`    |
| `height`       | `height`         | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `tabContentId` | `tab-content-id` | Determines the associated tab content element.                                       | `HTMLBrTabContentElement \| string`                                                         | `undefined`    |
| `value`        | `value`          | Defines the value of the component.                                                  | `string \| undefined`                                                                       | `undefined`    |
| `width`        | `width`          | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Events

| Event         | Description                                                                        | Type                                           |
| ------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `valueChange` | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: string \| undefined; }>` |


## Slots

| Slot | Description                          |
| ---- | ------------------------------------ |
|      | Passes the Tab Item to the Tab List. |


----------------------------------------------



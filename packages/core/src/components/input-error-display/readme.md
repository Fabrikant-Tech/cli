# Input error display



<!-- Auto Generated Below -->


## Overview

The Input Error Display component alerts a user to input errors. You can use props to customize the error display type or render a custom message using the `message` slot.

## Properties

| Property            | Attribute | Description                                 | Type                    | Default        |
| ------------------- | --------- | ------------------------------------------- | ----------------------- | -------------- |
| `theme`             | `theme`   | Defines the theme of the component.         | `"Dark" \| "Light"`     | `ThemeDefault` |
| `type` _(required)_ | `type`    | Determines the type of component to render. | `"inline" \| "tooltip"` | `undefined`    |


## Slots

| Slot        | Description                                      |
| ----------- | ------------------------------------------------ |
| `"icon"`    | A slot to pass the icon of the error display.    |
| `"message"` | A slot to pass the message of the error display. |


----------------------------------------------



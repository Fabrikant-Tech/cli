# Form



<!-- Auto Generated Below -->


## Overview

The Form component enables a user to submit information.

## Properties

| Property           | Attribute            | Description                                                                          | Type                                                                                        | Default                     |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------- |
| `errorDisplayType` | `error-display-type` | Determines whether an error message should be displayed and if yes which type.       | `"toast" \| "tooltip" \| undefined`                                                         | `'tooltip'`                 |
| `focusOnError`     | `focus-on-error`     | Determines if the component focuses the first error on submit.                       | `boolean`                                                                                   | `true`                      |
| `fullHeight`       | `full-height`        | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`                 |
| `fullWidth`        | `full-width`         | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`                 |
| `height`           | `height`             | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                 |
| `internalId`       | `internal-id`        | The unique internal ID of the component.                                             | `string`                                                                                    | `` `br-form-${formId++}` `` |
| `theme`            | `theme`              | * Defines the theme of the component.                                                | `"Dark" \| "Light"`                                                                         | `ThemeDefault`              |
| `width`            | `width`              | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                 |


## Events

| Event                | Description                                                                                                                                          | Type                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `formSubmission`     | An event that emits when the form is submitted. The detail contains the native form event enabling both custom and default form submission behavior. | `CustomEvent<Event>`                                                                                             |
| `formValidityChange` | An event that emits when the form validity state changes.                                                                                            | `CustomEvent<{ valid: boolean; errors?: { [key: string]: FormCustomError \| FormNativeError; } \| undefined; }>` |


## Methods

### `getInternalValidityState() => Promise<FormValidity>`

A method to get the validity state of the form.

#### Returns

Type: `Promise<FormValidity>`




----------------------------------------------



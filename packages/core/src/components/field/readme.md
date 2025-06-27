# Field

<!-- Auto Generated Below -->


## Overview

The Field component is a wrapper for the input component. It can be used to display labels, hints, and/or error messages for the input, depending on the props.

## Usage

### Key example

```jsx live
<BrContainer
  width="240px"
  direction="column"
  verticalGap="16px"
  alignment="center"
  margin={{ top: '16px', right: '16px', bottom: '16px', left: '16px' }}
>
  <BrField fullWidth={true}>
    <span>Name</span>
    <BrInput fullWidth={true} showClearButton={false} />
  </BrField>
  <BrField fullWidth={true}>
    <span>Email</span>
    <BrInput fullWidth={true} showClearButton={false} />
  </BrField>
  <BrField fullWidth={true}>
    <span>Company</span>
    <BrInput fullWidth={true} showClearButton={false} />
  </BrField>
</BrContainer>
```



## Properties

| Property    | Attribute    | Description                                                                         | Type                                                                                        | Default      |
| ----------- | ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| `direction` | `direction`  | Determines the direction the content is displayed in the component.                 | `"horizontal" \| "vertical"`                                                                | `'vertical'` |
| `fullWidth` | `full-width` | Determines if the component expands to fill the available horizontal space.         | `boolean \| undefined`                                                                      | `undefined`  |
| `width`     | `width`      | The width in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`  |


## Slots

| Slot | Description                                      |
| ---- | ------------------------------------------------ |
|      | Passes the input and label to the Field element. |


----------------------------------------------



# Tag

<!-- Auto Generated Below -->


## Overview

The Tag component is used to display a small amount of information in a compact format.

## Usage

### Clear icon

```jsx live
<BrTag showClearIcon="true">Tag content</BrTag>
```


### Color type

```jsx live
<BrContainer horizontalGap="16px" direction="row">
  <BrTag colorType="Constructive">Tag content</BrTag>
  <BrTag colorType="Destructive">Tag content</BrTag>
  <BrTag colorType="Neutral">Tag content</BrTag>
  <BrTag colorType="Primary">Tag content</BrTag>
  <BrTag colorType="Warning">Tag content</BrTag>
</BrContainer>
```


### Key example

```jsx live
<BrContainer horizontalGap="16px" direction="row">
  <BrTag>Tag content</BrTag>
  <BrTag>
    <span>Tag content</span>
    <BrIcon slot="left-icon" iconName="A" />
  </BrTag>
  <BrTag>
    <span>Tag content</span>
    <BrIcon slot="right-icon" iconName="CaretDown" />
  </BrTag>
</BrContainer>
```


### Size and shape

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrContainer horizontalGap="16px" direction="row">
    <BrTag size="Large">Tag content</BrTag>
    <BrTag size="Normal">Tag content</BrTag>
    <BrTag size="Small">Tag content</BrTag>
    <BrTag size="Xsmall">Tag content</BrTag>
  </BrContainer>
  <BrContainer horizontalGap="16px" direction="row">
    <BrTag shape="Circular" size="Large">
      Tag content
    </BrTag>
    <BrTag shape="Circular" size="Normal">
      Tag content
    </BrTag>
    <BrTag shape="Circular" size="Small">
      Tag content
    </BrTag>
    <BrTag shape="Circular" size="Xsmall">
      Tag content
    </BrTag>
  </BrContainer>
</BrContainer>
```



## Properties

| Property        | Attribute         | Description                                                                              | Type                                                                     | Default                   |
| --------------- | ----------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------- |
| `colorType`     | `color-type`      | Defines the semantic color applied to the component.                                     | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"` | `'Primary'`               |
| `ellipsis`      | `ellipsis`        | Determines if the component displays an ellipsis when the text does not fit the wrapper. | `boolean \| undefined`                                                   | `true`                    |
| `fillStyle`     | `fill-style`      | Defines the fill style applied to the component.                                         | `"Ghost" \| "Solid"`                                                     | `'Solid'`                 |
| `focusable`     | `focusable`       | Determines whether the component should be focusable.                                    | `boolean \| undefined`                                                   | `undefined`               |
| `internalId`    | `internal-id`     | The unique internal ID of the component.                                                 | `string`                                                                 | `` `br-tag-${tagId++}` `` |
| `shape`         | `shape`           | Defines the shape style applied to the component.                                        | `"Circular" \| "Rectangular"`                                            | `'Rectangular'`           |
| `showClearIcon` | `show-clear-icon` | Determines if the clear affordance is displayed in the component.                        | `boolean`                                                                | `false`                   |
| `size`          | `size`            | Defines the size style applied to the component.                                         | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                             | `'Normal'`                |
| `theme`         | `theme`           | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                      | `ThemeDefault`            |


## Events

| Event   | Description                                          | Type                |
| ------- | ---------------------------------------------------- | ------------------- |
| `clear` | Emits an event when the clear affordance is clicked. | `CustomEvent<void>` |


## Slots

| Slot           | Description                  |
| -------------- | ---------------------------- |
|                | A slot for the text content. |
| `"left-icon"`  | A slot for the left icon.    |
| `"right-icon"` | A slot for the right icon.   |


----------------------------------------------



# Button

<!-- Auto Generated Below -->


## Overview

The Button is an interactive component that users activate via a mouse click or other input. It can be used to submit forms, acknowledge information, or to enable a user to interact with a page in other ways.

## Usage

### Color type

#### Primary

```jsx live
<BrButton colorType="Primary">
  <span>Primary</span>
</BrButton>
```

#### Neutral

```jsx live
<BrButton colorType="Neutral">
  <span>Neutral</span>
</BrButton>
```

#### Constructive

```jsx live
<BrButton colorType="Constructive">
  <span>Constructive</span>
</BrButton>
```

#### Destructive

```jsx live
<BrButton colorType="Destructive">
  <span>Destructive</span>
</BrButton>
```

#### Warning

```jsx live
<BrButton colorType="Warning">
  <span>Warning</span>
</BrButton>
```


### Control group

Buttons can be grouped using the Control Group component.

```jsx live
<BrControlGroup direction="horizontal">
  <BrButton fullWidth={false}>
    <span>Left</span>
  </BrButton>
  <BrButton fullWidth={false}>
    <span>Center</span>
  </BrButton>
  <BrButton fullWidth={false}>
    <span>Right</span>
  </BrButton>
</BrControlGroup>
```


### Fill style

#### Ghost

```jsx live
<BrButton fillStyle="Ghost">
  <span>Ghost</span>
</BrButton>
```

#### Solid

```jsx live
<BrButton fillStyle="Solid">
  <span>Solid</span>
</BrButton>
```


### Full width

The button width is relative to the content inside by default. The `fullWidth` prop will make the button expand to the width of the parent container.

#### Default width

```jsx live
<BrButton>
  <span>Default button</span>
</BrButton>
```

#### Full width

```jsx live
<BrButton fullWidth={true}>
  <span>Full width</span>
</BrButton>
```


### Key example

```jsx live
<BrContainer direction="horizontal" horizontalGap="16px">
  <BrButton colorType="Neutral">
    <span>Button</span>
  </BrButton>
  <BrButton colorType="Neutral">
    <BrIcon slot="left-icon" iconName="DotsHorizontal" color="Neutral" />
  </BrButton>
  <BrButton colorType="Neutral">
    <BrIcon slot="left-icon" iconName="Paperclip" color="Neutral" />
    <span>Copy</span>
  </BrButton>
  <BrButton colorType="Neutral">
    <BrIcon slot="right-icon" iconName="CaretDown" color="Neutral" />
    <span>Select</span>
  </BrButton>
</BrContainer>
```


### Size

#### Large

```jsx live
<BrButton size="Large">
  <span>Large</span>
</BrButton>
```

#### Normal

```jsx live
<BrButton size="Normal">
  <span>Normal</span>
</BrButton>
```

#### Small

```jsx live
<BrButton size="Small">
  <span>Small</span>
</BrButton>
```

#### Xsmall

```jsx live
<BrButton size="Xsmall">
  <span>Xsmall</span>
</BrButton>
```



## Properties

| Property                | Attribute                  | Description                                                                              | Type                                                                                        | Default                         |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------- |
| `active`                | `active`                   | Determines if the component is displayed in its active state.                            | `boolean \| undefined`                                                                      | `undefined`                     |
| `alignContentToMargins` | `align-content-to-margins` | Whether the content of the component is aligned to the component margins.                | `boolean \| undefined`                                                                      | `false`                         |
| `colorType`             | `color-type`               | Defines the semantic color applied to the component.                                     | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"`                    | `'Primary'`                     |
| `contentAlignment`      | `content-alignment`        | Determines the component's content alignment.                                            | `"Center" \| "Left" \| "Right"`                                                             | `'Center'`                      |
| `disabled`              | `disabled`                 | Determines if the component is displayed in its disabled state.                          | `boolean \| undefined`                                                                      | `undefined`                     |
| `ellipsis`              | `ellipsis`                 | Determines if the component displays an ellipsis when the text does not fit the wrapper. | `boolean \| undefined`                                                                      | `false`                         |
| `fillStyle`             | `fill-style`               | Defines the fill style applied to the component.                                         | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                       |
| `fullHeight`            | `full-height`              | Determines if the component expands to fill the available vertical space.                | `boolean \| undefined`                                                                      | `undefined`                     |
| `fullWidth`             | `full-width`               | Determines if the component expands to fill the available horizontal space.              | `boolean \| undefined`                                                                      | `undefined`                     |
| `height`                | `height`                   | The height in px or percentage. Token variables and calc strings are also supported.     | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                     |
| `hover`                 | `hover`                    | Determines if the component is displayed in its hover state.                             | `boolean \| undefined`                                                                      | `undefined`                     |
| `internalId`            | `internal-id`              | The unique internal ID of the component.                                                 | `string`                                                                                    | `` `br-button-${buttonId++}` `` |
| `shape`                 | `shape`                    | Defines the shape style applied to the component.                                        | `"Rectangular"`                                                                             | `'Rectangular'`                 |
| `size`                  | `size`                     | Defines the size style applied to the component.                                         | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                      |
| `square`                | `square`                   | Determines if the component is displayed with a width equal to its height.               | `boolean \| undefined`                                                                      | `undefined`                     |
| `theme`                 | `theme`                    | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                  |
| `type`                  | `type`                     | Determines the type associated with the component in a form context.                     | `"button" \| "reset" \| "submit" \| undefined`                                              | `'button'`                      |
| `value`                 | `value`                    | Defines the value of the component.                                                      | `number \| string \| string[] \| undefined`                                                 | `undefined`                     |
| `width`                 | `width`                    | The width in px or percentage. Token variables and calc strings are also supported.      | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                     |


## Slots

| Slot           | Description                                  |
| -------------- | -------------------------------------------- |
|                | Passes the button label.                     |
| `"left-icon"`  | Passes the left icon.                        |
| `"progress"`   | Passes the progress component to the button. |
| `"right-icon"` | Passes the right icon.                       |


----------------------------------------------



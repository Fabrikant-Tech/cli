# Info display

<!-- Auto Generated Below -->


## Overview

The Info Display component communicates information to users in a large callout box. You can use slots and props to create displays of different styles.

## Usage

### Color type

```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay colorType="Primary">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Primary Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay colorType="Neutral">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Neutral Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay colorType="Constructive">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Constructive Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay colorType="Destructive">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Destructive Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay colorType="Warning">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Warning Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```


### Content alignment

```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay contentAlignment="Left">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment left</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay contentAlignment="Right">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment right</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay contentAlignment="Center">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment centered (default)</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```


### Key example

```jsx live
<BrInfoDisplay size="Normal" colorType="Neutral">
  <BrIcon slot="decoration" iconName="Book" />
  <span slot="title">Info Display</span>
  <span slot="message">The Info display communicates information to users in a callout box.</span>
  <BrButton slot="actions" colorType="Constructive">
    <span>Got it</span>
  </BrButton>
  <BrButton slot="actions" colorType="Neutral" fillStyle="Ghost">
    <span>Cancel</span>
  </BrButton>
</BrInfoDisplay>
```


### Size

```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay size="Small">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Small Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay size="Normal">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Normal Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay size="Large">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Large Info Display</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```


### Width

```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay width="480px">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">480 pixels width</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay width="50%">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Width set to 50%</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay fullWidth={true}>
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Full width</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```



## Properties

| Property           | Attribute           | Description                                                                          | Type                                                                                        | Default        |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| `colorType`        | `color-type`        | Defines the semantic color applied to the component.                                 | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"`                    | `'Primary'`    |
| `contentAlignment` | `content-alignment` | Determines the component's content alignment.                                        | `"Center" \| "Left" \| "Right"`                                                             | `'Center'`     |
| `fullHeight`       | `full-height`       | Determines if the component expands to fill the available vertical space.            | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`        | `full-width`        | Determines if the component expands to fill the available horizontal space.          | `boolean \| undefined`                                                                      | `undefined`    |
| `height`           | `height`            | The height in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `noBackground`     | `no-background`     | Determines whether the component displays a background.                              | `boolean \| undefined`                                                                      | `undefined`    |
| `size`             | `size`              | Defines the size style applied to the component.                                     | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`     |
| `theme`            | `theme`             | Defines the theme of the component.                                                  | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `width`            | `width`             | The width in px or percentage. Token variables and calc strings are also supported.  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Slots

| Slot           | Description                                             |
| -------------- | ------------------------------------------------------- |
| `"actions"`    | A slot to pass actions.                                 |
| `"decoration"` | Passes an icon or other decoration to the Info Display. |
| `"message"`    | Passes the description to the Info Display.             |
| `"title"`      | Passes the title to the Info Display.                   |


----------------------------------------------



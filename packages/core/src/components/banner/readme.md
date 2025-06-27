# Banner

<!-- Auto Generated Below -->


## Overview

The Banner component displays information and/or instructions in a container that is dismissible by default. You can use props and slots to create different Banner styles.

## Usage

### Close button

```jsx live
<BrContainer fullWidth={true} direction="column" verticalGap="24px">
  <BrBanner isOpen={true}>
    <BrIcon slot="icon" iconName="Book" />
    <span slot="title">Normal banner</span>
    <span slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
      Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus
      arcu aliquam tempor.
    </span>
    <BrButton slot="title-actions">Title action</BrButton>
    <BrButton slot="body-actions">Accept</BrButton>
    <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
      Cancel
    </BrButton>
  </BrBanner>

  <BrBanner isOpen={true} size="Small" showCloseAffordance={false}>
    <BrIcon slot="icon" iconName="Book" />
    <span slot="title">Small banner</span>
    <span slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
      Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus
      arcu aliquam tempor.
    </span>
    <BrButton slot="title-actions">Title action</BrButton>
    <BrButton slot="body-actions">Accept</BrButton>
    <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
      Cancel
    </BrButton>
  </BrBanner>
</BrContainer>
```


### Key example

```jsx live
<BrBanner isOpen={true}>
  <BrIcon slot="icon" iconName="Book" />
  <span slot="title">Banner title</span>
  <span slot="description">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
    Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus arcu
    aliquam tempor.
  </span>
  <BrButton slot="title-actions">Title action</BrButton>
  <BrButton slot="body-actions">Accept</BrButton>
  <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
    Cancel
  </BrButton>
</BrBanner>
```


### Size

```jsx live
<BrContainer fullWidth={true} direction="column" verticalGap="24px">
  <BrBanner isOpen={true} size="Normal">
    <BrIcon slot="icon" iconName="Book" />
    <span slot="title">Normal banner</span>
    <span slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
      Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus
      arcu aliquam tempor.
    </span>
    <BrButton slot="title-actions">Title action</BrButton>
    <BrButton slot="body-actions">Accept</BrButton>
    <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
      Cancel
    </BrButton>
  </BrBanner>

  <BrBanner isOpen={true} size="Small">
    <BrIcon slot="icon" iconName="Book" />
    <span slot="title">Small banner</span>
    <span slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
      Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus
      arcu aliquam tempor.
    </span>
    <BrButton slot="title-actions">Title action</BrButton>
    <BrButton slot="body-actions">Accept</BrButton>
    <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
      Cancel
    </BrButton>
  </BrBanner>
</BrContainer>
```



## Properties

| Property          | Attribute           | Description                                                                             | Type                                                                                        | Default        |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `colorType`       | `color-type`        | Defines the semantic color applied to the component.                                    | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"`                    | `'Primary'`    |
| `fillStyle`       | `fill-style`        | Defines the fill style applied to the component.                                        | `"Solid"`                                                                                   | `'Solid'`      |
| `fullHeight`      | `full-height`       | Determines if the component expands to fill the available vertical space.               | `boolean \| undefined`                                                                      | `undefined`    |
| `fullWidth`       | `full-width`        | Determines if the component expands to fill the available horizontal space.             | `boolean \| undefined`                                                                      | `undefined`    |
| `height`          | `height`            | The height in px or percentage. Token variables and calc strings are also supported.    | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |
| `isOpen`          | `is-open`           | Prop to track if the banner is open.                                                    | `boolean \| undefined`                                                                      | `undefined`    |
| `showCloseButton` | `show-close-button` | Whether the close affordance is shown, if it is not shown the banner is always visible. | `boolean`                                                                                   | `true`         |
| `size`            | `size`              | Defines the size style applied to the component.                                        | `"Normal" \| "Small"`                                                                       | `'Normal'`     |
| `theme`           | `theme`             | Defines the theme of the component.                                                     | `"Dark" \| "Light"`                                                                         | `ThemeDefault` |
| `width`           | `width`             | The width in px or percentage. Token variables and calc strings are also supported.     | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`    |


## Events

| Event   | Description                              | Type                |
| ------- | ---------------------------------------- | ------------------- |
| `close` | Event that emits when the banner closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the banner opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

A method to close the banner.

#### Returns

Type: `Promise<void>`



### `openElement() => Promise<void>`

A method to open the banner.

#### Returns

Type: `Promise<void>`




## Slots

| Slot              | Description                                       |
| ----------------- | ------------------------------------------------- |
| `"body-actions"`  | Passes actions to be rendered in the Banner body. |
| `"description"`   | Passes a description to the Banner.               |
| `"icon"`          | Passes an icon to the Banner.                     |
| `"title"`         | Passes the title to the Banner.                   |
| `"title-actions"` | Passes actions to be rendered in the Banner body. |


----------------------------------------------



# Theme context

<!-- Auto Generated Below -->


## Overview

The Theme Context component applies a light or dark mode theme to all child elements.

## Usage

### Key example

```jsx live
<BrThemeContext theme="Dark">
  <BrContainer
    verticalGap="12px"
    padding={{ left: '12px', top: '12px', right: '12px', bottom: '12px' }}
    border={{ type: 'solid', width: '1px', color: 'neutral' }}
    fullWidth="true"
    height="100px"
    directionAlignment="center"
    secondaryAlignment="center"
  >
    <BrInput width="240px" placeholder="I Am Dark Theme"></BrInput>
    <BrButton width="240px">Submit</BrButton>
  </BrContainer>
</BrThemeContext>
```

```jsx live
<BrThemeContext theme="Light">
  <BrContainer
    verticalGap="12px"
    padding={{ left: '12px', top: '12px', right: '12px', bottom: '12px' }}
    border={{ type: 'solid', width: '1px', color: 'neutral' }}
    fullWidth="true"
    height="100px"
    directionAlignment="center"
    secondaryAlignment="center"
  >
    <BrInput width="240px" placeholder="I Am Light Theme"></BrInput>
    <BrButton width="240px">Submit</BrButton>
  </BrContainer>
</BrThemeContext>
```



## Properties

| Property         | Attribute         | Description                                             | Type                | Default        |
| ---------------- | ----------------- | ------------------------------------------------------- | ------------------- | -------------- |
| `showBackground` | `show-background` | Determines whether the component displays a background. | `boolean`           | `true`         |
| `theme`          | `theme`           | Defines the theme of the component.                     | `"Dark" \| "Light"` | `ThemeDefault` |


## Events

| Event              | Description                                                                           | Type                |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------- |
| `themeChange`      | Emits when all elements have taken the theme. Can be used to support loading screens. | `CustomEvent<void>` |
| `themeChangeStart` | Emits when elements have started to take the theme.                                   | `CustomEvent<void>` |


## Slots

| Slot | Description                                          |
| ---- | ---------------------------------------------------- |
|      | Passes the child elements that the theme applies to. |


----------------------------------------------



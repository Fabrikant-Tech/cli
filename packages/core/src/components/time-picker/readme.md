# Time picker

<!-- Auto Generated Below -->


## Overview

The Time Picker component is a flexible time widget. Often used with the time input component, it enables users to select a time.

## Usage

### Format

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>12 hour format</span>
    <BrSeparator />
    <BrTimePicker format="12"></BrTimePicker>
  </BrField>
  <BrField>
    <span>24 hour format</span>
    <BrSeparator />
    <BrTimePicker format="24"></BrTimePicker>
  </BrField>
</BrContainer>
```


### Key example

```jsx live
<BrTimePicker></BrTimePicker>
```


### Precision

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>Second precision</span>
    <BrSeparator />
    <BrTimePicker precision="second"></BrTimePicker>
  </BrField>
  <BrField>
    <span>Millisecond precision</span>
    <BrSeparator />
    <BrTimePicker precision="millisecond"></BrTimePicker>
  </BrField>
</BrContainer>
```


### Show now button

The Show now button sets the component to the current date and time. This button is on by default, but can be removed.

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>With Show now button</span>
    <BrSeparator />
    <BrTimePicker showNowButton={true}></BrTimePicker>
  </BrField>
  <BrField>
    <span>Without Show now button</span>
    <BrSeparator />
    <BrTimePicker showNowButton={false}></BrTimePicker>
  </BrField>
</BrContainer>
```


### Size

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>Large</span>
    <BrSeparator />
    <BrTimePicker size="Large"></BrTimePicker>
  </BrField>
  <BrField>
    <span>Normal</span>
    <BrSeparator />
    <BrTimePicker size="Normal"></BrTimePicker>
  </BrField>
  <BrField>
    <span>Small</span>
    <BrSeparator />
    <BrTimePicker size="Small"></BrTimePicker>
  </BrField>
</BrContainer>
```



## Properties

| Property        | Attribute         | Description                                                                                      | Type                                              | Default        |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- | -------------- |
| `defaultValue`  | --                | Defines the default value of the component.                                                      | `Date \| undefined`                               | `undefined`    |
| `disabled`      | `disabled`        | Determines if the component is displayed in its disabled state.                                  | `boolean \| undefined`                            | `undefined`    |
| `format`        | `format`          | Defines the time format of the component.                                                        | `12 \| 24`                                        | `12`           |
| `max`           | --                | Determines the maximum value for the component.                                                  | `Date \| undefined`                               | `undefined`    |
| `min`           | --                | Determines the minimum value for the component.                                                  | `Date \| undefined`                               | `undefined`    |
| `name`          | `name`            | Defines the name associated with this component in the context of a form.                        | `string`                                          | `undefined`    |
| `precision`     | `precision`       | Determines the precision of the component selection.                                             | `"hour" \| "millisecond" \| "minute" \| "second"` | `'minute'`     |
| `showNowButton` | `show-now-button` | Determines whether an affordance for selecting the current date and time with the set precision. | `boolean`                                         | `true`         |
| `size`          | `size`            | Defines the size style applied to the component.                                                 | `"Large" \| "Normal" \| "Small" \| "Xsmall"`      | `'Normal'`     |
| `theme`         | `theme`           | Defines the theme of the component.                                                              | `"Dark" \| "Light"`                               | `ThemeDefault` |
| `value`         | --                | Defines the value of the component.                                                              | `Date \| undefined`                               | `undefined`    |


## Events

| Event         | Description                                                                        | Type                                         |
| ------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| `valueChange` | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: Date \| undefined; }>` |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the picker

#### Returns

Type: `Promise<void>`



### `scrollToCurrentValue() => Promise<void>`

Method to scroll to the currently selected value;

#### Returns

Type: `Promise<void>`




## Slots

| Slot                       | Description                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `"me-am-content"`          | Passes content to the am meridiem button if present.                                   |
| `"me-pm-content"`          | Passes content to the pm meridiem button if present.                                   |
| `"{{type}}-{{v}}-content"` | Dynamic slot name that allows passing content to each individual button in the picker. |


----------------------------------------------



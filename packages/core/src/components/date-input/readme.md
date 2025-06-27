# Date input

<!-- Auto Generated Below -->


## Overview

The Date input component enables a user to enter a date.

## Usage

### Clear button

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="With clear button" showClearButton={true}></BrDateInput>
  <BrDateInput
    width="320px"
    placeholder="Without clear button"
    showClearButton={false}
  ></BrDateInput>
</BrContainer>
```


### Controlled

The date input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const TWO_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 2;
const TWO_DAYS_AGO = new Date(Date.now() - TWO_DAYS_IN_MS);

function ControlledExample() {
  const [value, setValue] = useState(TWO_DAYS_AGO);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrDateInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```


### Fill style

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="Solid" fillStyle="Solid"></BrDateInput>
  <BrDateInput width="320px" placeholder="Ghost" fillStyle="Ghost"></BrDateInput>
</BrContainer>
```


### Format options

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="12 hour format" format="12"></BrDateInput>
  <BrDateInput width="320px" placeholder="24 hour format" format="24"></BrDateInput>
</BrContainer>
```


### Key example

```jsx live
<BrDateInput width="320px" placeholder="Type in a time value"></BrDateInput>
```


### Locale

The locale for the date picker is specified by the `locale` prop, which takes a language-sensitive string representation of the date. Reference the two-letter language and country codes, defined by [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) and [ISO-3166-1](https://en.wikipedia.org/wiki/ISO_3166-1). This example is set to Farsi/Iran.

```jsx live
<BrDateInput width="320px" placeholder="Locale set to Iran" locale="fa-IR"></BrDateInput>
```


### Min-max allowed

The `min` and `max` props are `Date` objects that set the earliest and latest allowable dates. In this example, the component is limited to dates between today and five days from now.

```jsx live noInline
const MIN_DATE = new Date();
const MAX_DATE = new Date(new Date().setDate(new Date().getDate() + 5));

function MinMaxExample() {
  return (
    <BrDateInput
      width="320px"
      placeholder="Limited between today and today+5"
      min={MIN_DATE}
      max={MAX_DATE}
    ></BrDateInput>
  );
}

render(<MinMaxExample />);
```


### Precision

Precision can be set to month, day, hour, minute, second, or millisecond.

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="Month" precision="month"></BrDateInput>
  <BrDateInput width="320px" placeholder="Day" precision="day"></BrDateInput>
  <BrDateInput width="320px" placeholder="Minute" precision="minute"></BrDateInput>
  <BrDateInput width="320px" placeholder="Second" precision="second"></BrDateInput>
</BrContainer>
```


### Show now button

The Show now button sets the component to the current time. This button is on by default, but can be removed.

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="With now button" showNowButton={true}></BrDateInput>
  <BrDateInput width="320px" placeholder="Without now button" showNowButton={false}></BrDateInput>
</BrContainer>
```


### Size

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="Large" size="Large"></BrDateInput>
  <BrDateInput width="320px" placeholder="Normal" size="Normal"></BrDateInput>
  <BrDateInput width="320px" placeholder="Small" size="Small"></BrDateInput>
</BrContainer>
```


### States

```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrDateInput width="320px" placeholder="Default state"></BrDateInput>
  <BrDateInput width="320px" placeholder="Active state" active={true}></BrDateInput>
  <BrDateInput width="320px" placeholder="Disabled state" disabled={true}></BrDateInput>
  <BrDateInput width="320px" placeholder="Required" required={true}></BrDateInput>
</BrContainer>
```



## Properties

| Property            | Attribute             | Description                                                                                           | Type                                                                                        | Default                           |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------- |
| `active`            | `active`              | Determines if the component is displayed in its active state.                                         | `boolean \| undefined`                                                                      | `undefined`                       |
| `autoComplete`      | `auto-complete`       | Determines whether the component supports autocomplete.                                               | `string \| undefined`                                                                       | `'off'`                           |
| `autoFocus`         | `auto-focus`          | Determines whether the component autofocuses.                                                         | `boolean \| undefined`                                                                      | `undefined`                       |
| `defaultValue`      | --                    | Defines the default value of the component.                                                           | `Date \| undefined`                                                                         | `undefined`                       |
| `disabled`          | `disabled`            | Determines if the component is displayed in its disabled state.                                       | `boolean`                                                                                   | `false`                           |
| `errorDisplayType`  | `error-display-type`  | Determines whether an error message should be displayed and if yes which type.                        | `"inline" \| "tooltip" \| boolean`                                                          | `'tooltip'`                       |
| `fillStyle`         | `fill-style`          | Defines the fill style applied to the component.                                                      | `"Ghost" \| "Solid"`                                                                        | `'Solid'`                         |
| `format`            | `format`              | Defines the time format of the component.                                                             | `12 \| 24`                                                                                  | `24`                              |
| `fullHeight`        | `full-height`         | Determines if the component expands to fill the available vertical space.                             | `boolean \| undefined`                                                                      | `undefined`                       |
| `fullWidth`         | `full-width`          | Determines if the component expands to fill the available horizontal space.                           | `boolean \| undefined`                                                                      | `undefined`                       |
| `height`            | `height`              | The height in px or percentage. Token variables and calc strings are also supported.                  | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                       |
| `internalId`        | `internal-id`         | The unique internal ID of the component.                                                              | `string`                                                                                    | `` `br-input-${dateInputId++}` `` |
| `invalidAfterTouch` | `invalid-after-touch` | Defines whether the component should display an invalid state after an event and/or a specific event. | `"blur" \| "change" \| "click" \| "input" \| boolean`                                       | `'input'`                         |
| `largeStep`         | `large-step`          | Determines the increment value when the user clicks the stepper affordance and holds the shift key.   | `number`                                                                                    | `10`                              |
| `locale`            | `locale`              | Defines the locale of the component.                                                                  | `string`                                                                                    | `'en-US'`                         |
| `max`               | --                    | Determines the maximum value for the component.                                                       | `Date`                                                                                      | `defaultMaxDate`                  |
| `min`               | --                    | Determines the minimum value for the component.                                                       | `Date`                                                                                      | `defaultMinDate`                  |
| `name`              | `name`                | Defines the name associated with this component in the context of a form.                             | `string`                                                                                    | `undefined`                       |
| `placeholder`       | `placeholder`         | Determines the placeholder displayed in the component.                                                | `string \| undefined`                                                                       | `undefined`                       |
| `precision`         | `precision`           | Determines the precision of the component selection.                                                  | `"day" \| "hour" \| "millisecond" \| "minute" \| "month" \| "second"`                       | `'minute'`                        |
| `readonly`          | `readonly`            | Determines if the component is displayed in its readonly state.                                       | `boolean`                                                                                   | `false`                           |
| `required`          | `required`            | Determines if the component is required in a form context.                                            | `boolean \| undefined`                                                                      | `undefined`                       |
| `shape`             | `shape`               | Defines the shape style applied to the component.                                                     | `"Rectangular"`                                                                             | `'Rectangular'`                   |
| `showClearButton`   | `show-clear-button`   | Determines if the clear affordance is displayed in the component.                                     | `boolean \| undefined`                                                                      | `true`                            |
| `showFillDays`      | `show-fill-days`      | Determines if the days of the previous and next month should be displayed in the component.           | `boolean`                                                                                   | `false`                           |
| `showNowButton`     | `show-now-button`     | Determines whether an affordance for selecting the current date and time with the set precision.      | `boolean`                                                                                   | `true`                            |
| `size`              | `size`                | Defines the size style applied to the component.                                                      | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                        |
| `step`              | `step`                | Determines the increment value when the user clicks the stepper affordance.                           | `number`                                                                                    | `1`                               |
| `theme`             | `theme`               | Defines the theme of the component.                                                                   | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                    |
| `validations`       | --                    | Defines the data validations that apply to this component.                                            | `CustomValidator<Date \| undefined>[] \| undefined`                                         | `undefined`                       |
| `value`             | --                    | Defines the value of the component.                                                                   | `Date \| undefined`                                                                         | `undefined`                       |
| `width`             | `width`               | The width in px or percentage. Token variables and calc strings are also supported.                   | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                       |


## Events

| Event            | Description                                                                        | Type                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change`         | Emits an event when the native HTML change event emits.                            | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `input`          | Emits an event when the native HTML input event emits.                             | `CustomEvent<{ value: string \| undefined; }>`                                                                                                     |
| `validityChange` | An event that emits when the validity state changes.                               | `CustomEvent<{ valid: boolean; customErrors?: { [key: string]: string; } \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; }>` |
| `valueChange`    | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: Date \| undefined; }>`                                                                                                       |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the input

#### Returns

Type: `Promise<void>`



### `getInternalValidityState() => Promise<{ valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }>`

Method to get the validity state.

#### Returns

Type: `Promise<{ valid: boolean; firstError?: string | undefined; nativeErrors?: { [key: string]: string; } | undefined; customErrors?: { [key: string]: string; } | undefined; }>`



### `setInternalValidityState(validity: { valid: boolean; firstError?: string; nativeErrors?: { [key: string]: string; }; customErrors?: { [key: string]: string; }; }) => Promise<void>`

A method to set a custom validity state

#### Parameters

| Name       | Type                                                                                                                                                                    | Description |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `validity` | `{ valid: boolean; firstError?: string \| undefined; nativeErrors?: { [key: string]: string; } \| undefined; customErrors?: { [key: string]: string; } \| undefined; }` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `"error-message"` | Enables passing a error message to the internal display. |
| `"hint"`          | Enables passing a custom hint display.                   |
| `"inline-error"`  | Passes a custom error display inline.                    |
| `"left-icon"`     | Passes an icon to the Input.                             |
| `"right-icon"`    | Passes additional content to the Input.                  |
| `"tooltip-error"` | Passes a custom error display as a tooltip.              |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"resizer"` |             |


----------------------------------------------



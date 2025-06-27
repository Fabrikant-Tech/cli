# Date picker

<!-- Auto Generated Below -->


## Overview

The Date Picker component is a flexible calendar widget. Often used with the date input component, it enables users to select a single date, a date range, or multiple dates, depending on its props.

## Usage

### Key example

```jsx live
<BrDatePicker></BrDatePicker>
```


### Locale

The locale for the date picker is specified by the `locale` prop, which takes a language-sensitive string representation of the date. Reference the two-letter language and country codes, defined by [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) and [ISO-3166-1](https://en.wikipedia.org/wiki/ISO_3166-1). This example is set to Farsi/Iran.

```jsx live
<BrDatePicker locale="fa-IR"></BrDatePicker>
```


### Min-max allowed

The `min` and `max` props are `Date` objects that set the earliest and latest allowable dates. In this example, the component is limited to dates between today and five days from now.

```jsx live noInline
const MIN_DATE = new Date();
const MAX_DATE = new Date(new Date().setDate(new Date().getDate() + 5));

function MinMaxExample() {
  return (
    <BrDatePicker
      width="320px"
      placeholder="Limited between today and today+5"
      min={MIN_DATE}
      max={MAX_DATE}
    ></BrDatePicker>
  );
}

render(<MinMaxExample />);
```


### Precision

Precision can be set to month, day, hour, minute, second, or millisecond.

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>Month precision</span>
    <BrSeparator />
    <BrDatePicker precision="month"></BrDatePicker>
  </BrField>
  <BrField>
    <span>Minute precision</span>
    <BrSeparator />
    <BrDatePicker precision="minute"></BrDatePicker>
  </BrField>
</BrContainer>
```


### Show today button

The Show today button sets the component to the current date. This button is on by default, but can be removed.

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>With Show today button</span>
    <BrSeparator />
    <BrDatePicker showTodayButton={true}></BrDatePicker>
  </BrField>
  <BrField>
    <span>Without Show today button</span>
    <BrSeparator />
    <BrDatePicker showTodayButton={false}></BrDatePicker>
  </BrField>
</BrContainer>
```


### Show week number

The Week number can also be displayed.

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>With Show week number</span>
    <BrSeparator />
    <BrDatePicker showWeekNumber={true}></BrDatePicker>
  </BrField>
  <BrField>
    <span>Without Show week number</span>
    <BrSeparator />
    <BrDatePicker showWeekNumber={false}></BrDatePicker>
  </BrField>
</BrContainer>
```


### Size

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrField>
    <span>Large</span>
    <BrSeparator />
    <BrDatePicker size="Large"></BrDatePicker>
  </BrField>
  <BrField>
    <span>Normal</span>
    <BrSeparator />
    <BrDatePicker size="Normal"></BrDatePicker>
  </BrField>
  <BrField>
    <span>Small</span>
    <BrSeparator />
    <BrDatePicker size="Small"></BrDatePicker>
  </BrField>
</BrContainer>
```



## Properties

| Property                      | Attribute                        | Description                                                                                               | Type                                                                  | Default          |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------- |
| `currentView`                 | --                               | The current view state.                                                                                   | `Date`                                                                | `undefined`      |
| `defaultValue`                | --                               | Defines the default value of the component.                                                               | `Date[] \| undefined`                                                 | `undefined`      |
| `defaultView`                 | --                               | Determines the default view the component opens on.                                                       | `Date \| undefined`                                                   | `undefined`      |
| `disabled`                    | `disabled`                       | Determines if the component is displayed in its disabled state.                                           | `boolean \| undefined`                                                | `undefined`      |
| `firstCalendarDay`            | `first-calendar-day`             | Determines which day of the week is presented as the first day in the component.                          | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                     | `0`              |
| `format`                      | `format`                         | Defines the time format of the component.                                                                 | `12 \| 24`                                                            | `12`             |
| `highlightToday`              | `highlight-today`                | Determines if the component highlights the current date when in view.                                     | `boolean`                                                             | `true`           |
| `locale`                      | `locale`                         | Defines the locale of the component.                                                                      | `string`                                                              | `'en-US'`        |
| `max`                         | --                               | Determines the maximum value for the component.                                                           | `Date`                                                                | `defaultMaxDate` |
| `min`                         | --                               | Determines the minimum value for the component.                                                           | `Date`                                                                | `defaultMinDate` |
| `name`                        | `name`                           | Defines the name associated with this component in the context of a form.                                 | `string`                                                              | `undefined`      |
| `precision`                   | `precision`                      | Determines the precision of the component selection.                                                      | `"day" \| "hour" \| "millisecond" \| "minute" \| "month" \| "second"` | `'day'`          |
| `selectingSameValueDeselects` | `selecting-same-value-deselects` | Determines if a previously selected value is deselected when the user selects it again.                   | `boolean`                                                             | `true`           |
| `selection`                   | `selection`                      | Determines the selection allowed by the component.                                                        | `"multiple" \| "range" \| "single"`                                   | `'single'`       |
| `showFillDays`                | `show-fill-days`                 | Determines if the days of the previous and next month should be displayed in the component.               | `boolean`                                                             | `false`          |
| `showNowButton`               | `show-now-button`                | Determines whether an affordance for selecting the current date and time with the set precision.          | `boolean`                                                             | `true`           |
| `showTodayButton`             | `show-today-button`              | Determines whether an affordance for selecting the current date with the set precision.                   | `boolean`                                                             | `true`           |
| `showWeekNumber`              | `show-week-number`               | Determines if a week number is also displayed.                                                            | `boolean`                                                             | `false`          |
| `size`                        | `size`                           | Defines the size style applied to the component.                                                          | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                          | `'Normal'`       |
| `theme`                       | `theme`                          | Defines the theme of the component.                                                                       | `"Dark" \| "Light"`                                                   | `ThemeDefault`   |
| `value`                       | --                               | Defines the value of the component.                                                                       | `Date[] \| undefined`                                                 | `undefined`      |
| `variableHeight`              | `variable-height`                | Determines if the height of the component is kept consistent regardless of the number of items displayed. | `boolean`                                                             | `false`          |


## Events

| Event               | Description                                                                        | Type                                           |
| ------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `currentViewChange` | Emits an event whenever the current view changes.                                  | `CustomEvent<{ value: Date; }>`                |
| `valueChange`       | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: Date[] \| undefined; }>` |


## Methods

### `clearValue() => Promise<void>`

A method to clear the value of the picker

#### Returns

Type: `Promise<void>`



### `scrollToCurrentValue() => Promise<void>`

Method to scroll to the currently selected value;

#### Returns

Type: `Promise<void>`



### `setCurrentView(date: Date) => Promise<void>`

Method to set the current view of the date picker.;

#### Parameters

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| `date` | `Date` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot                                    | Description                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `"week-{{week}}-content"`               | Dynamic slot name that allows passing content to the number representing the week.                                   |
| `"{{year}}-{{month}}-content"`          | Dynamic slot name that allows passing content to the buttons representing the months when precision is set to month. |
| `"{{year}}-{{month}}-{{date}}-content"` | Dynamic slot name that allows passing content to the buttons representing the days when precision is not month.      |


----------------------------------------------



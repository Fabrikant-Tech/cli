The min and max allowable times are set using the [International Date Time Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

```jsx live
<BrTimeInput
  width="320px"
  placeholder="Min time is set to current time"
  min={new Date()}
></BrTimeInput>
```

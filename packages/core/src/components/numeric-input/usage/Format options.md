Numbers can be formatted according to the [International Number Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Formatted numerical inputs"
  formatOptions={{ useGrouping: true, maximumFractionDigits: 2, minimumFractionDigits: 2 }}
></BrNumericInput>
```

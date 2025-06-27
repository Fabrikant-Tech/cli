The locale prop can be used to localize numbering systems. This example applies Turkish locale, where the thousands separator is a dot and the decimal seporator is a comma.

```jsx live
<BrNumericInput
  width="320px"
  placeholder="Locale set to Turkey"
  locale="tr-TR"
  formatOptions={{ useGrouping: true, maximumFractionDigits: 2, minimumFractionDigits: 2 }}
></BrNumericInput>
```

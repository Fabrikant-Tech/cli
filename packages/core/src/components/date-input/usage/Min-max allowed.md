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

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

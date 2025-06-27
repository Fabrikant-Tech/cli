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

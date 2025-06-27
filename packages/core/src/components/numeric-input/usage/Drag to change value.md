```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrNumericInput
    width="320px"
    placeholder="Click & drag horizontally"
    dragToChangeValue="horizontal"
    min={-50}
    max={100}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Click & drag vertically"
    dragToChangeValue="vertical"
    min={-50}
    max={100}
  ></BrNumericInput>
  <BrNumericInput
    width="320px"
    placeholder="Click & drag off"
    dragToChangeValue={false}
    min={-50}
    max={100}
  ></BrNumericInput>
</BrContainer>
```

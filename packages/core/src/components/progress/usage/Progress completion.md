The progress completion can be set by the value prop.

```jsx live
<BrContainer direction="row" horizontalGap="16px">
  <BrContainer direction="column" verticalGap="16px" width="120px">
    <BrField>
      <BrFieldLabel>Value: 25%</BrFieldLabel>
      <BrProgress value="25%" />
    </BrField>
    <BrField>
      <BrFieldLabel>Value: 50%</BrFieldLabel>
      <BrProgress value="50%" />
    </BrField>
    <BrField>
      <BrFieldLabel>Value: 75%</BrFieldLabel>
      <BrProgress value="75%" />
    </BrField>
  </BrContainer>
  <BrContainer direction="column" verticalGap="16px" width="120px">
    <BrField fullWidth={true}>
      <BrFieldLabel>Value: 25%</BrFieldLabel>
      <BrProgress value="25%" shape="Linear" />
    </BrField>
    <BrField fullWidth={true}>
      <BrFieldLabel>Value: 50%</BrFieldLabel>
      <BrProgress value="50%" shape="Linear" />
    </BrField>
    <BrField fullWidth={true}>
      <BrFieldLabel>Value: 75%</BrFieldLabel>
      <BrProgress value="75%" shape="Linear" />
    </BrField>
  </BrContainer>
</BrContainer>
```

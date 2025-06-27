```jsx live
<BrContainer direction="row" horizontalGap="16px">
  <BrContainer direction="column" verticalGap="16px" width="120px">
    <BrField>
      <BrFieldLabel>Large Circular</BrFieldLabel>
      <BrProgress size="Large" />
    </BrField>
    <BrField>
      <BrFieldLabel>Normal Circular</BrFieldLabel>
      <BrProgress size="Normal" />
    </BrField>
    <BrField>
      <BrFieldLabel>Small Circular</BrFieldLabel>
      <BrProgress size="Small" />
    </BrField>
  </BrContainer>
  <BrContainer direction="column" verticalGap="16px" width="120px">
    <BrField fullWidth={true}>
      <BrFieldLabel>Large Linear</BrFieldLabel>
      <BrProgress size="Large" shape="Linear" />
    </BrField>
    <BrField fullWidth={true}>
      <BrFieldLabel>Normal Linear</BrFieldLabel>
      <BrProgress size="Normal" shape="Linear" />
    </BrField>
    <BrField fullWidth={true}>
      <BrFieldLabel>Small Linear</BrFieldLabel>
      <BrProgress size="Small" shape="Linear" />
    </BrField>
  </BrContainer>
</BrContainer>
```

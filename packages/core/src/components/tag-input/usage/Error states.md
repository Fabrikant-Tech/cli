The following Tag Inputs are set so a component is required in the form context. Clear the contents of each tag input to show the error display type.

```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput
    placeholder="Inline error"
    required={true}
    errorDisplayType="inline"
    value={['Inline error']}
    fullWidth={true}
  />
  <BrTagInput
    placeholder="Tooltip error"
    required={true}
    errorDisplayType="tooltip"
    value={['Tooltip error']}
    fullWidth={true}
  />
  <BrTagInput
    placeholder="Boolean error"
    required={true}
    errorDisplayType="boolean"
    value={['Boolean error']}
    fullWidth={true}
  />
</BrContainer>
```

The following Text Areas are set so an entry is required in the form context. Clear the contents of each text area to show the error display type.

```jsx live
<BrContainer direction="column" verticalGap="36px" width="360px">
  <BrTextArea
    placeholder="Inline error"
    required={true}
    height="64px"
    errorDisplayType="inline"
    value="Inline error"
    fullWidth={true}
  />
  <BrTextArea
    placeholder="Tooltip error"
    required={true}
    height="64px"
    errorDisplayType="tooltip"
    value="Tooltip error"
    fullWidth={true}
  />
  <BrTextArea
    placeholder="Boolean error"
    required={true}
    height="64px"
    errorDisplayType="boolean"
    value="Boolean error"
    fullWidth={true}
  />
</BrContainer>
```

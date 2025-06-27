```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTextArea fullWidth={true} placeholder="Default" value="Default" />
  <BrTextArea fullWidth={true} placeholder="Active" active={true} value="Active" />
  <BrTextArea fullWidth={true} disabled={true} value="Disabled" />
  <BrTextArea fullWidth={true} readonly={true} value="Read only" />
  <BrTextArea
    fullWidth={true}
    placehloder="Typing not allowed"
    typingAllowed={false}
    value="Typing not allowed"
  />
</BrContainer>
```

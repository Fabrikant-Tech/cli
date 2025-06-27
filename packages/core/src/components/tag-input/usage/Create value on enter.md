```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput placeholder="This generates a tag on enter" fullWidth={true} />
  <BrTagInput
    placeholder="This does not generate a tag on enter"
    fullWidth={true}
    createValueOnEnter={false}
  />
</BrContainer>
```

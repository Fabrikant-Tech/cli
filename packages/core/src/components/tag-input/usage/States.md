```jsx live
<BrContainer direction="column" verticalGap="16px" width="360px">
  <BrTagInput fullWidth={true} placeholder="Default" value={['Default']} />
  <BrTagInput fullWidth={true} placeholder="Active" active={true} value={['Active']} />
  <BrTagInput fullWidth={true} disabled={true} value={['Disabled']} />
  <BrTagInput fullWidth={true} readonly={true} value={['Read only']} />
  <BrTagInput
    fullWidth={true}
    placeholder="Typing not allowed"
    typingAllowed={false}
    value={['Typing not allowed']}
  />
</BrContainer>
```

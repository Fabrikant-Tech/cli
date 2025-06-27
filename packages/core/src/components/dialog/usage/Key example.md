Dialogs can be opened by a child element that is in the `target` slot without having to manage the open state manually.

```jsx live
<BrDialog>
  <BrButton slot="target">
    <span>Open Dialog</span>
  </BrButton>
  <BrDialogContent>
    <BrDialogHeader>Update Profile</BrDialogHeader>
    <BrContainer
      direction="column"
      verticalGap="16px"
      alignment="center"
      width="320px"
      padding={{ bottom: '16px' }}
    >
      <BrField fullWidth={true}>
        <span>Name</span>
        <BrInput fullWidth={true} showClearButton={false} />
      </BrField>
      <BrField fullWidth={true}>
        <span>Email</span>
        <BrInput fullWidth={true} showClearButton={false} />
      </BrField>
      <BrField fullWidth={true}>
        <span>Company</span>
        <BrInput fullWidth={true} showClearButton={false} />
      </BrField>
    </BrContainer>
    <BrDialogFooter>
      <BrButton fillStyle="Ghost" colorType="Neutral">
        <span>Cancel</span>
      </BrButton>
      <BrButton fillStyle="Solid" colorType="Primary">
        <span>Done</span>
      </BrButton>
    </BrDialogFooter>
  </BrDialogContent>
</BrDialog>
```

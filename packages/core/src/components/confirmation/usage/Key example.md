Confirmations can be opened by a child element that is in the `target` slot without having to manage the open state manually.

```jsx live
<BrConfirmation focusTargetOnClose={true} shouldCloseOnClickOutside={true} trapFocus={true}>
  <BrButton slot="target" ellipsis={true}>
    <span>Click to open confirmation</span>
  </BrButton>
  <BrConfirmationContent>
    <BrConfirmationHeader>Header title</BrConfirmationHeader>
    <span>Confirmation body content</span>
    <BrConfirmationFooter>
      <BrButton fillStyle="Ghost">
        <span>Cancel</span>
      </BrButton>
      <BrButton>
        <span>Done</span>
      </BrButton>
    </BrConfirmationFooter>
  </BrConfirmationContent>
</BrConfirmation>
```

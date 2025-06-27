Drawers can be opened by a child element that is in the `target` slot without having to manage the open state manually.

```jsx live
<BrDrawer focusTargetOnClose={true} shouldCloseOnClickOutside={true} trapFocus={true}>
  <BrButton slot="target" ellipsis={true}>
    <span>Click to open drawer</span>
  </BrButton>
  <BrDrawerContent>
    <BrDrawerHeader>Header title</BrDrawerHeader>
    <span>Drawer body content</span>
    <BrDrawerFooter>
      <BrButton fillStyle="Ghost">
        <span>Cancel</span>
      </BrButton>
      <BrButton>
        <span>Done</span>
      </BrButton>
    </BrDrawerFooter>
  </BrDrawerContent>
</BrDrawer>
```

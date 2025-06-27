The Menu component is designed to work in conjunction with the Menu item, Popover, and Popover content components.

```jsx live
<BrPopover>
  <BrButton slot="target" colorType="Neutral">
    <span>Hover me</span>
  </BrButton>
  <BrPopoverContent>
    <BrMenu>
      <BrMenuItem>
        <span>Edit shipment...</span>
      </BrMenuItem>
      <BrMenuItem>
        <span>View on map</span>
      </BrMenuItem>
      <BrSeparator width="100%" height="1px" />
      <BrMenuItem colorType="Destructive">
        <span>Delete shipment</span>
      </BrMenuItem>
    </BrMenu>
  </BrPopoverContent>
</BrPopover>
```

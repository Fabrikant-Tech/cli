# Menu

<!-- Auto Generated Below -->


## Overview

The Menu component displays a list of actions or items. It is the parent component of the Menu Item and Menu Nesting components.

## Usage

### Key example

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



## Slots

| Slot | Description                        |
| ---- | ---------------------------------- |
|      | Passes the Menu Items to the Menu. |


----------------------------------------------



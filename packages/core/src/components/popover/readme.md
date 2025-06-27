# Popover

<!-- Auto Generated Below -->


## Overview

The Popover component displays content relative to a target when a particular action occurs.

## Usage

### Hover

```jsx live
<BrPopover interaction="hover">
  <BrButton slot="target">
    <span>Hover to open popover</span>
  </BrButton>
  <BrPopoverContent>
    <span>Popover content</span>
  </BrPopoverContent>
</BrPopover>
```


### Key example

```jsx live
<BrPopover>
  <BrButton slot="target">
    <span>Click to open popover</span>
  </BrButton>
  <BrPopoverContent>
    <span>Popover content</span>
  </BrPopoverContent>
</BrPopover>
```


### Match target width

```jsx live
<BrPopover constrainToTargetWidth={true}>
  <BrInput width="420px" placeholder="Type in a value" slot="target"></BrInput>
  <BrPopoverContent>
    <span>This popover matches the input width</span>
  </BrPopoverContent>
</BrPopover>
```


### Placement

```jsx live
<BrPopover placement="right">
  <BrButton slot="target">
    <span>Click to open popover</span>
  </BrButton>
  <BrPopoverContent>
    <span>This popover shows to the right of the target</span>
  </BrPopoverContent>
</BrPopover>
```


### Popover arrow

```jsx live
<BrPopover showArrow={false}>
  <BrButton slot="target">
    <span>Click to open popover</span>
  </BrButton>
  <BrPopoverContent>
    <span>No popover arrow</span>
  </BrPopoverContent>
</BrPopover>
```



## Properties

| Property                    | Attribute                       | Description                                                                                                                                                                                         | Type                                                                                                                                                                 | Default                           |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `activateTargetOnOpen`      | `activate-target-on-open`       | Determines whether the target should be activated on hover. Accepts a true or false value which sets the target active prop to true or a string value for the attribute that should be set to true. | `boolean \| string \| undefined`                                                                                                                                     | `undefined`                       |
| `closesOtherPopovers`       | `closes-other-popovers`         | Determines if other open components of the same type should close when this component closes.                                                                                                       | `boolean \| undefined`                                                                                                                                               | `undefined`                       |
| `constrainToTargetWidth`    | `constrain-to-target-width`     | Determines if the component is constrained to the width of the target.                                                                                                                              | `boolean \| undefined`                                                                                                                                               | `false`                           |
| `containHeight`             | `contain-height`                | Determines if the component should fit the content in the available height either side of the target.                                                                                               | `boolean`                                                                                                                                                            | `true`                            |
| `contentClassname`          | `content-classname`             | Defines a classname to be applied to the content.                                                                                                                                                   | `string \| undefined`                                                                                                                                                | `undefined`                       |
| `disabled`                  | `disabled`                      | Determines if the component is displayed in its disabled state.                                                                                                                                     | `boolean`                                                                                                                                                            | `undefined`                       |
| `flip`                      | `flip`                          | Determines if the component should flip if it goes off screen.                                                                                                                                      | `boolean \| undefined`                                                                                                                                               | `true`                            |
| `focusContentOnOpen`        | `focus-content-on-open`         | Determines whether the component focuses the content when it opens.                                                                                                                                 | `boolean \| undefined`                                                                                                                                               | `true`                            |
| `focusTargetOnClose`        | `focus-target-on-close`         | Determines whether the component focuses the target when it closes.                                                                                                                                 | `boolean \| undefined`                                                                                                                                               | `true`                            |
| `hoverTimerDuration`        | `hover-timer-duration`          | Determines the timeout before the component closes when the mouse leaves the target.                                                                                                                | `number \| undefined`                                                                                                                                                | `undefined`                       |
| `interaction`               | `interaction`                   | Determines the interaction that triggers the component.                                                                                                                                             | `"click" \| "hover"`                                                                                                                                                 | `'click'`                         |
| `internalId`                | `internal-id`                   | The unique internal ID of the component.                                                                                                                                                            | `string`                                                                                                                                                             | `` `br-popover-${popoverId++}` `` |
| `isOpen`                    | `is-open`                       | Determines whether the component is open.                                                                                                                                                           | `boolean \| undefined`                                                                                                                                               | `undefined`                       |
| `minWidth`                  | `min-width`                     | The min width in px or reference to the target.                                                                                                                                                     | `"reference" \| boolean \| number`                                                                                                                                   | `'reference'`                     |
| `offset`                    | --                              | Determines the x and y offset the component is displayed from the target.                                                                                                                           | `[number, number] \| undefined`                                                                                                                                      | `undefined`                       |
| `placement`                 | `placement`                     | Determines the placement of the component.                                                                                                                                                          | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom'`                        |
| `portalDestination`         | `portal-destination`            | Determines where the component is rendered when opened.                                                                                                                                             | `"inline" \| "root" \| Element \| undefined`                                                                                                                         | `'root'`                          |
| `shift`                     | `shift`                         | Determines if the component should shift if it goes off screen.                                                                                                                                     | `"overlap" \| boolean \| undefined`                                                                                                                                  | `undefined`                       |
| `shouldCloseOnClickOutside` | `should-close-on-click-outside` | Determines whether the component closes when a click happens outside of it.                                                                                                                         | `boolean`                                                                                                                                                            | `true`                            |
| `shouldCloseOnESCKey`       | `should-close-on-e-s-c-key`     | Determines whether the component closes when ESC is pressed.                                                                                                                                        | `boolean`                                                                                                                                                            | `true`                            |
| `showArrow`                 | `show-arrow`                    | Determines if the arrow is displayed in the component.                                                                                                                                              | `boolean`                                                                                                                                                            | `true`                            |
| `strategy`                  | `strategy`                      | Determines the strategy for positioning the component.                                                                                                                                              | `"absolute" \| "fixed" \| undefined`                                                                                                                                 | `undefined`                       |
| `theme`                     | `theme`                         | Defines the theme of the component.                                                                                                                                                                 | `"Dark" \| "Light"`                                                                                                                                                  | `ThemeDefault`                    |
| `trapFocus`                 | `trap-focus`                    | Determines whether the component traps focus.                                                                                                                                                       | `boolean \| undefined`                                                                                                                                               | `true`                            |


## Events

| Event   | Description                               | Type                |
| ------- | ----------------------------------------- | ------------------- |
| `close` | Event that emits when the popover closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the popover opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

A method to close the popover.

#### Returns

Type: `Promise<void>`



### `openElement(anchor?: globalThis.Element | PopoverTargetBox) => Promise<void>`

A method to open the popover.

#### Parameters

| Name     | Type                                       | Description |
| -------- | ------------------------------------------ | ----------- |
| `anchor` | `Element \| PopoverTargetBox \| undefined` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                               |
| ---------- | ----------------------------------------- |
|            | Passes content to the Popover.            |
| `"target"` | Passes the target element of the Popover. |


----------------------------------------------



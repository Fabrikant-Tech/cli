# Drawer

<!-- Auto Generated Below -->


## Overview

The Drawer component displays content relative to a target when a particular action occurs.

## Usage

### Controlled

Drawers can be controlled via the `isOpen` prop and managing state with the `open` and `close` events.

```jsx live noInline
function ControlledExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BrButton onClick={handleClick}>
        <span>Open Drawer</span>
      </BrButton>
      <BrDrawer isOpen={isOpen} onClose={handleClose}>
        <BrDrawerContent>
          <BrDrawerHeader>Header title</BrDrawerHeader>
          <span>Drawer body content</span>
          <BrDrawerFooter>
            <BrButton onClick={handleClose} fillStyle="Ghost">
              <span>Cancel</span>
            </BrButton>
            <BrButton onClick={handleClose}>
              <span>Done</span>
            </BrButton>
          </BrDrawerFooter>
        </BrDrawerContent>
      </BrDrawer>
    </>
  );
}

render(<ControlledExample />);
```


### Key example

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



## Properties

| Property                    | Attribute                       | Description                                                                                   | Type                                         | Default                         |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------- |
| `closesOtherDrawers`        | `closes-other-drawers`          | Determines if other open components of the same type should close when this component closes. | `boolean \| undefined`                       | `undefined`                     |
| `contentClassname`          | `content-classname`             | Defines a classname to be applied to the content.                                             | `string \| undefined`                        | `undefined`                     |
| `focusContentOnOpen`        | `focus-content-on-open`         | Determines whether the component focuses the content when it opens.                           | `boolean \| undefined`                       | `true`                          |
| `focusTargetOnClose`        | `focus-target-on-close`         | Determines whether the component focuses the target when it closes.                           | `boolean \| undefined`                       | `true`                          |
| `internalId`                | `internal-id`                   | The unique internal ID of the component.                                                      | `string`                                     | `` `br-drawer-${drawerId++}` `` |
| `isOpen`                    | `is-open`                       | Determines whether the component is open.                                                     | `boolean \| undefined`                       | `undefined`                     |
| `placement`                 | `placement`                     | Determines the placement of the component.                                                    | `"bottom" \| "left" \| "right" \| "top"`     | `'right'`                       |
| `portalDestination`         | `portal-destination`            | Determines where the component is rendered when opened.                                       | `"inline" \| "root" \| Element \| undefined` | `'root'`                        |
| `shouldCloseOnClickOutside` | `should-close-on-click-outside` | Determines whether the component closes when a click happens outside of it.                   | `boolean`                                    | `true`                          |
| `shouldCloseOnESCKey`       | `should-close-on-e-s-c-key`     | Determines whether the component closes when ESC is pressed.                                  | `boolean`                                    | `true`                          |
| `strategy`                  | `strategy`                      | Determines the strategy for positioning the component.                                        | `"absolute" \| "fixed" \| undefined`         | `'fixed'`                       |
| `theme`                     | `theme`                         | Defines the theme of the component.                                                           | `"Dark" \| "Light"`                          | `ThemeDefault`                  |
| `trapFocus`                 | `trap-focus`                    | Determines whether the component traps focus.                                                 | `boolean \| undefined`                       | `true`                          |


## Events

| Event   | Description                              | Type                |
| ------- | ---------------------------------------- | ------------------- |
| `close` | Event that emits when the drawer closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the drawer opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

A method to close the drawer.

#### Returns

Type: `Promise<void>`



### `openElement() => Promise<void>`

A method to open the drawer.

#### Returns

Type: `Promise<void>`



### `setInternalMaxDrawerStackIndex(value: number | undefined) => Promise<void>`

A method to update the maxStackIndex externally.

#### Parameters

| Name    | Type                  | Description |
| ------- | --------------------- | ----------- |
| `value` | `number \| undefined` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                              |
| ---------- | ---------------------------------------- |
|            | Passes content to the Drawer.            |
| `"target"` | Passes the target element of the Drawer. |


----------------------------------------------



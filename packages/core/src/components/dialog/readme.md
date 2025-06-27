# Dialog

<!-- Auto Generated Below -->


## Overview

The Dialog component displays content relative to a target when a particular action occurs.

## Usage

### Controlled

Dialogs can be controlled via the `isOpen` prop and managing state with the `open` and `close` events.

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
        <span>Open Dialog</span>
      </BrButton>
      <BrDialog isOpen={isOpen} onClose={handleClose}>
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
            <BrButton fillStyle="Ghost" colorType="Neutral" onClick={handleClose}>
              <span>Cancel</span>
            </BrButton>
            <BrButton fillStyle="Solid" colorType="Primary" onClick={handleClose}>
              <span>Done</span>
            </BrButton>
          </BrDialogFooter>
        </BrDialogContent>
      </BrDialog>
    </>
  );
}

render(<ControlledExample />);
```


### Key example

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



## Properties

| Property                    | Attribute                       | Description                                                                                   | Type                                         | Default                         |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------- |
| `closesOtherDialogs`        | `closes-other-dialogs`          | Determines if other open components of the same type should close when this component closes. | `boolean \| undefined`                       | `undefined`                     |
| `contentClassname`          | `content-classname`             | Defines a classname to be applied to the content.                                             | `string \| undefined`                        | `undefined`                     |
| `focusContentOnOpen`        | `focus-content-on-open`         | Determines whether the component focuses the content when it opens.                           | `boolean \| undefined`                       | `true`                          |
| `focusTargetOnClose`        | `focus-target-on-close`         | Determines whether the component focuses the target when it closes.                           | `boolean \| undefined`                       | `true`                          |
| `internalId`                | `internal-id`                   | The unique internal ID of the component.                                                      | `string`                                     | `` `br-dialog-${dialogId++}` `` |
| `isOpen`                    | `is-open`                       | Determines whether the component is open.                                                     | `boolean \| undefined`                       | `undefined`                     |
| `portalDestination`         | `portal-destination`            | Determines where the component is rendered when opened.                                       | `"inline" \| "root" \| Element \| undefined` | `'root'`                        |
| `shouldCloseOnClickOutside` | `should-close-on-click-outside` | Determines whether the component closes when a click happens outside of it.                   | `boolean`                                    | `true`                          |
| `shouldCloseOnESCKey`       | `should-close-on-e-s-c-key`     | Determines whether the component closes when ESC is pressed.                                  | `boolean`                                    | `true`                          |
| `strategy`                  | `strategy`                      | Determines the strategy for positioning the component.                                        | `"absolute" \| "fixed" \| undefined`         | `'absolute'`                    |
| `theme`                     | `theme`                         | Defines the theme of the component.                                                           | `"Dark" \| "Light"`                          | `ThemeDefault`                  |
| `trapFocus`                 | `trap-focus`                    | Determines whether the component traps focus.                                                 | `boolean \| undefined`                       | `true`                          |


## Events

| Event   | Description                              | Type                |
| ------- | ---------------------------------------- | ------------------- |
| `close` | Event that emits when the dialog closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the dialog opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

A method to close the dialog.

#### Returns

Type: `Promise<void>`



### `openElement() => Promise<void>`

A method to open the dialog.

#### Returns

Type: `Promise<void>`



### `setInternalMaxDialogStackIndex(value: number | undefined) => Promise<void>`

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
|            | Passes content to the Dialog.            |
| `"target"` | Passes the target element of the Dialog. |


----------------------------------------------



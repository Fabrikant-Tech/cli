# Confirmation



<!-- Auto Generated Below -->


## Overview

The Confirmation component displays content relative to a target when a particular action occurs.

## Usage

### Controlled

Confirmations can be opened by a child element that is in the `target` slot without having to manage the open state manually.

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
        <span>Open confirmation</span>
      </BrButton>
      <BrConfirmation isOpen={isOpen} onClose={handleClose}>
        <BrConfirmationContent>
          <BrConfirmationHeader>Header title</BrConfirmationHeader>
          <span>Confirmation body content</span>
          <BrConfirmationFooter>
            <BrButton onClick={handleClose} fillStyle="Ghost">
              <span>Cancel</span>
            </BrButton>
            <BrButton onClick={handleClose}>
              <span>Done</span>
            </BrButton>
          </BrConfirmationFooter>
        </BrConfirmationContent>
      </BrConfirmation>
    </>
  );
}

render(<ControlledExample />);
```


### Key example

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



## Properties

| Property                    | Attribute                       | Description                                                                                   | Type                                         | Default                                     |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| `closesOtherConfirmations`  | `closes-other-confirmations`    | Determines if other open components of the same type should close when this component closes. | `boolean \| undefined`                       | `undefined`                                 |
| `contentClassname`          | `content-classname`             | Defines a classname to be applied to the content.                                             | `string \| undefined`                        | `undefined`                                 |
| `focusContentOnOpen`        | `focus-content-on-open`         | Determines whether the component focuses the content when it opens.                           | `boolean \| undefined`                       | `true`                                      |
| `focusTargetOnClose`        | `focus-target-on-close`         | Determines whether the component focuses the target when it closes.                           | `boolean \| undefined`                       | `true`                                      |
| `internalId`                | `internal-id`                   | The unique internal ID of the component.                                                      | `string`                                     | `` `br-confirmation-${confirmationId++}` `` |
| `isOpen`                    | `is-open`                       | Determines whether the component is open.                                                     | `boolean \| undefined`                       | `undefined`                                 |
| `portalDestination`         | `portal-destination`            | Determines where the component is rendered when opened.                                       | `"inline" \| "root" \| Element \| undefined` | `'root'`                                    |
| `shouldCloseOnClickOutside` | `should-close-on-click-outside` | Determines whether the component closes when a click happens outside of it.                   | `boolean`                                    | `false`                                     |
| `shouldCloseOnESCKey`       | `should-close-on-e-s-c-key`     | Determines whether the component closes when ESC is pressed.                                  | `boolean`                                    | `true`                                      |
| `strategy`                  | `strategy`                      | Determines the strategy for positioning the component.                                        | `"absolute" \| "fixed" \| undefined`         | `'absolute'`                                |
| `theme`                     | `theme`                         | Defines the theme of the component.                                                           | `"Dark" \| "Light"`                          | `ThemeDefault`                              |
| `trapFocus`                 | `trap-focus`                    | Determines whether the component traps focus.                                                 | `boolean \| undefined`                       | `true`                                      |


## Events

| Event   | Description                                    | Type                |
| ------- | ---------------------------------------------- | ------------------- |
| `close` | Event that emits when the confirmation closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the confirmation opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

A method to close the confirmation.

#### Returns

Type: `Promise<void>`



### `openElement() => Promise<void>`

A method to open the confirmation.

#### Returns

Type: `Promise<void>`



### `setInternalMaxConfirmationStackIndex(value: number | undefined) => Promise<void>`

A method to update the maxStackIndex externally.

#### Parameters

| Name    | Type                  | Description |
| ------- | --------------------- | ----------- |
| `value` | `number \| undefined` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                    |
| ---------- | ---------------------------------------------- |
|            | Passes content to the Confirmation.            |
| `"target"` | Passes the target element of the Confirmation. |


----------------------------------------------



# Toast

<!-- Auto Generated Below -->


## Overview

The Toast component is a small message that pops up at the bottom of the screen. It is often used to provide quick status updates.

Refer to examples to explore different toast styles and behaviors.

## Usage

### Compositional toast example

<BrToast fillStyle="Solid" colorType="Primary">
    <BrIcon iconName="Book" slot="icon"></BrIcon>
    <span slot="title">Compositional toast</span>
    <span>This toast is created compositionally, and will render on page load.</span>
</BrToast>

```
<BrToast fillStyle="Solid" colorType="Primary">
    <BrIcon iconName="Book" slot="icon"></BrIcon>
    <span slot="title">Compositional toast</span>
    <span>This toast is created compositionally, and will render on page load.</span>
</BrToast>
```


### Key example

```jsx live noInline
function ToastExample() {
  const toastProviderRef = useRef(null);

  return (
    <>
      <BrContainer direction="column" verticalGap="24px">
        <BrButton
          onClick={() =>
            toastProviderRef.current?.open({
              id: 'toast1',
              fillStyle: 'Ghost',
              colorType: 'Constructive',
              title: 'Expiring toast',
              description:
                'This toast will automatically close after 3 seconds. No action is required.',
              iconName: 'Book',
              expiration: 3000,
            })
          }
        >
          <span>Expiring toast</span>
        </BrButton>
        <BrButton
          onClick={() =>
            toastProviderRef.current?.open({
              id: 'toast1',
              fillStyle: 'Ghost',
              colorType: 'Constructive',
              title: 'Non-expiring toast',
              description: 'To close the toast, click the close button.',
              iconName: 'Book',
              expiration: 'none',
            })
          }
        >
          <span>Non-expiring toast</span>
        </BrButton>
      </BrContainer>
      <BrToastProvider ref={toastProviderRef} />
    </>
  );
}

return <ToastExample />;
```



## Properties

| Property     | Attribute     | Description                                          | Type                                                                     | Default                       |
| ------------ | ------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------- |
| `colorType`  | `color-type`  | Defines the semantic color applied to the component. | `"Constructive" \| "Destructive" \| "Neutral" \| "Primary" \| "Warning"` | `'Neutral'`                   |
| `expiration` | `expiration`  | Determines the component's expiration time.          | `"none" \| number`                                                       | `3000`                        |
| `fillStyle`  | `fill-style`  | Defines the fill style applied to the component.     | `"Ghost" \| "Solid"`                                                     | `'Solid'`                     |
| `internalId` | `internal-id` | The unique internal ID of the component.             | `string`                                                                 | `` `br-toast-${toastId++}` `` |
| `size`       | `size`        | Defines the size style applied to the component.     | `"Normal" \| "Small"`                                                    | `'Normal'`                    |
| `theme`      | `theme`       | Defines the theme of the component.                  | `"Dark" \| "Light"`                                                      | `ThemeDefault`                |


## Events

| Event   | Description                             | Type                |
| ------- | --------------------------------------- | ------------------- |
| `close` | Event that emits when the toast closes. | `CustomEvent<void>` |
| `open`  | Event that emits when the toast opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

Closes the Toast.

#### Returns

Type: `Promise<void>`



### `resetTimekeeper(restart: boolean) => Promise<void>`

Restarts the timekeeper.

#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `restart` | `boolean` |             |

#### Returns

Type: `Promise<void>`




## Slots

| Slot              | Description                         |
| ----------------- | ----------------------------------- |
|                   | Passes a description for the Toast. |
| `"body-actions"`  | Passes actions for the Toast.       |
| `"icon"`          | Passes an icon to the Toast.        |
| `"title"`         | Passes a title to the Toast.        |
| `"title-actions"` | Passes actions for the Toast title. |


----------------------------------------------



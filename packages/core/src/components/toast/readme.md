# Toast Provider

<!-- Auto Generated Below -->


## Overview

The Toast Provider wraps a toast component and gives it CRUD capabilities. It is a required component when using a toast.

## Usage

### Compositional toast example

```jsx live
<BrToast fillStyle="Solid" colorType="Primary">
  <BrIcon iconName="Book" slot="icon"></BrIcon>
  <span slot="title">Compositional toast</span>
  <span>This toast is created compositionally, and will render on page load.</span>
</BrToast>
```


### Key example

### Key example

```jsx live noInline
function ToastDemo() {
  const toastProviderRef = useRef(null);

  return (
    <>
      <BrContainer direction="column" verticalGap="24px">
        <BrButton
          onClick={() => {
            toastProviderRef.current?.open({
              id: 'toast1',
              fillStyle: 'Ghost',
              colorType: 'Constructive',
              title: 'Expiring toast',
              description:
                'This toast will automatically close after 3 seconds. No action is required.',
              iconName: 'Book',
              expiration: 3000,
            });
          }}
        >
          <span>Expiring toast</span>
        </BrButton>
        <BrButton
          onClick={() => {
            toastProviderRef.current?.open({
              id: 'toast1',
              fillStyle: 'Ghost',
              colorType: 'Constructive',
              title: 'Non-expiring toast',
              description: 'To close the toast, click the close button.',
              iconName: 'Book',
              expiration: 'none',
            });
          }}
        >
          <span>Non-expiring toast</span>
        </BrButton>
      </BrContainer>
      <BrToastProvider ref={toastProviderRef} placement="right" alignment="bottom" />
    </>
  );
}

render(<ToastDemo />);
```



## Properties

| Property     | Attribute     | Description                                | Type                            | Default                                        |
| ------------ | ------------- | ------------------------------------------ | ------------------------------- | ---------------------------------------------- |
| `alignment`  | `alignment`   | Determines the component's alignment.      | `"bottom" \| "center" \| "top"` | `'bottom'`                                     |
| `internalId` | `internal-id` | The unique internal ID of the component.   | `string`                        | `` `br-toast-provider-${toastProviderId++}` `` |
| `latestTop`  | `latest-top`  | Determines where the latest toast appears. | `boolean`                       | `true`                                         |
| `placement`  | `placement`   | Defines the placement of the component.    | `"center" \| "left" \| "right"` | `'right'`                                      |
| `theme`      | `theme`       | Defines the theme of the component.        | `"Dark" \| "Light"`             | `ThemeDefault`                                 |


## Methods

### `open(options: ToastOptions) => Promise<HTMLBrToastElement | undefined>`

Opens a Toast.

#### Parameters

| Name      | Type           | Description |
| --------- | -------------- | ----------- |
| `options` | `ToastOptions` |             |

#### Returns

Type: `Promise<HTMLBrToastElement | undefined>`



### `update(options: ToastOptions) => Promise<HTMLBrToastElement | undefined>`

Updates a toast.

#### Parameters

| Name      | Type           | Description |
| --------- | -------------- | ----------- |
| `options` | `ToastOptions` |             |

#### Returns

Type: `Promise<HTMLBrToastElement | undefined>`




----------------------------------------------



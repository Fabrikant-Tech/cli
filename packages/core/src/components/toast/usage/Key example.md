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

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

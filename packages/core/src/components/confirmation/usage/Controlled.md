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

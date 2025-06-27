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

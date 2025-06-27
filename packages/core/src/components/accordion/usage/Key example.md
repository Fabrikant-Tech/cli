```jsx live noInline
function KeyExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <BrButton onClick={() => setIsOpen((isOpen) => !isOpen)}>Toggle Accordion</BrButton>
      <BrAccordion isOpen={isOpen}>
        <BrContainer
          width="320px"
          height="240px"
          border={{ type: 'solid', width: '1px', color: 'neutral' }}
          directionAlignment="center"
          secondaryAlignment="center"
        >
          <span>Accordion content</span>
        </BrContainer>
      </BrAccordion>
    </>
  );
}

render(<KeyExample />);
```

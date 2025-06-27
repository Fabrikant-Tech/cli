The tag input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(['tag1', 'tag2']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrTagInput
      placeholder="Type in a value and press enter"
      value={value}
      onValueChange={handleChange}
    />
  );
}

render(<ControlledExample />);
```

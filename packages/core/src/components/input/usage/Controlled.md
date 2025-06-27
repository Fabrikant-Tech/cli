The input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState('Type something');

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```

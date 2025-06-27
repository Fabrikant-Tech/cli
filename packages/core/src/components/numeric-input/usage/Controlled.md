The numeric input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(1234);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrNumericInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```

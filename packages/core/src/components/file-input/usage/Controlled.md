The file input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrFileInput onValueChange={handleChange} value={value} width="320px" />;
}

render(<ControlledExample />);
```

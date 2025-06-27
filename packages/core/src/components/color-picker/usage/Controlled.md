The color picker component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState('#ffffff');

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrColorPicker onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```

The file upload component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrFileUpload onValueChange={handleChange} value={value} height="64px" width="320px" />;
}

render(<ControlledExample />);
```

The switch component can be controlled via the `checked` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    const checked = event.detail.value !== '';
    setChecked(checked);
  };

  return (
    <BrSwitch onValueChange={handleChange} checked={checked}>
      <span>{checked ? 'Checked' : 'Not checked'}</span>
    </BrSwitch>
  );
}

render(<ControlledExample />);
```

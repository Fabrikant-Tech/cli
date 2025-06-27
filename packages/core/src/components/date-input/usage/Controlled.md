The date input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const TWO_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 2;
const TWO_DAYS_AGO = new Date(Date.now() - TWO_DAYS_IN_MS);

function ControlledExample() {
  const [value, setValue] = useState(TWO_DAYS_AGO);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrDateInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```

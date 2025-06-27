The time input component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const TEN_MINUTES_IN_MS = 1000 * 60 * 10;
const TEN_MINUTES_AGO = new Date(Date.now() - TEN_MINUTES_IN_MS);

function ControlledExample() {
  const [value, setValue] = useState(TEN_MINUTES_AGO);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return <BrTimeInput onValueChange={handleChange} value={value} />;
}

render(<ControlledExample />);
```

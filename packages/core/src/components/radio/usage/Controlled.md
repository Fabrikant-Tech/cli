The radio component can be controlled via the `checked` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrContainer direction="column" verticalGap="16px">
      <BrFieldLabel associatedInputId="demo-1">Contact preference</BrFieldLabel>
      <BrRadio
        name="contactPreference"
        id="contactPreference-email"
        value="email"
        checked={value === 'email'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-email">Email</BrFieldLabel>
      </BrRadio>
      <BrRadio
        name="contactPreference"
        id="contactPreference-text"
        value="text"
        checked={value === 'text'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-text">Text</BrFieldLabel>
      </BrRadio>
      <BrRadio
        name="contactPreference"
        id="contactPreference-mail"
        value="mail"
        checked={value === 'mail'}
        onValueChange={handleChange}
      >
        <BrFieldLabel associatedInputId="contactPreference-mail">Mail</BrFieldLabel>
      </BrRadio>
    </BrContainer>
  );
}

render(<ControlledExample />);
```

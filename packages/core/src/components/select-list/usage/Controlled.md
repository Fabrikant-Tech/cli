The select list component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const DOG_BREEDS = [
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'Australian Shepherd',
  'Basset Hound',
];

function ControlledExample() {
  const [value, setValue] = useState(['Akita']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrSelectList fullWidth={true} onValueChange={handleChange} value={value}>
      {DOG_BREEDS.map((dog) => {
        return (
          <BrSelectListItem key={dog} fullWidth={true} value={dog}>
            <span>{dog}</span>
          </BrSelectListItem>
        );
      })}
    </BrSelectList>
  );
}

render(<ControlledExample />);
```

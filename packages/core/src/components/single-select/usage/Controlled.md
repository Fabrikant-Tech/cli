The single select component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
const DOG_BREEDS = [
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'Australian Shepherd',
  'Basset Hound',
  'Beagle',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Bloodhound',
  'Border Collie',
];

function ControlledExample() {
  const [value, setValue] = useState(['Akita']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrSingleSelect onValueChange={handleChange} value={value}>
      <BrPopover>
        <BrButton colorType="Neutral" alignContentToMargins={true} fullWidth={true} slot="target">
          <BrSingleSelectIcon slot="left-icon" />
          <BrSingleSelectValue />
          <BrSingleSelectIndicator />
        </BrButton>
        <BrPopoverContent>
          <BrSelectList fullWidth={true}>
            {DOG_BREEDS.map((dog) => {
              return (
                <BrSelectListItem key={dog} fullWidth={true} value={dog}>
                  <span>{dog}</span>
                </BrSelectListItem>
              );
            })}
          </BrSelectList>
        </BrPopoverContent>
      </BrPopover>
    </BrSingleSelect>
  );
}

render(<ControlledExample />);
```

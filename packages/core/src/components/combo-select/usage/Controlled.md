The combo select component can be controlled via the `value` prop and managing state with the `valueChange` event.

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
    <BrComboSelect onValueChange={handleChange} value={value}>
      <BrPopover>
        <BrInput fullWidth={true} slot="target">
          <BrSingleSelectIcon slot="left-icon" />
          <BrSingleSelectIndicator />
        </BrInput>
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
    </BrComboSelect>
  );
}

render(<ControlledExample />);
```

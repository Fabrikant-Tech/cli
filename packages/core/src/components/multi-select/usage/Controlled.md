The multi select component can be controlled via the `value` prop and managing state with the `valueChange` event.

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
  const [value, setValue] = useState(['Akita', 'Beagle']);

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrMultiSelect onValueChange={handleChange} value={value}>
      <BrPopover>
        <BrTagInput fullWidth={true} slot="target" placeholder="Select a dog..." value={value}>
          <BrSingleSelectIndicator />
        </BrTagInput>
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
    </BrMultiSelect>
  );
}

render(<ControlledExample />);
```

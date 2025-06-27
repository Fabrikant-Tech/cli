```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrField fullWidth={false}>
    <BrFieldLabel size="Normal" associatedInputId="demo-1">
      This is a radio group.
    </BrFieldLabel>
    <BrRadio
      name="demo"
      id="demo-1"
      value="demo-1"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-1">Radio 1</BrFieldLabel>
    </BrRadio>
    <BrRadio
      name="demo"
      id="demo-2"
      value="demo-2"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-2">Radio 2</BrFieldLabel>
    </BrRadio>
    <BrRadio
      name="demo"
      id="demo-3"
      value="demo-3"
      onValueChange={(e) => {
        document.querySelectorAll('br-radio[name="demo"]').forEach((radio) => {
          radio.checked = radio.value === e.detail.value;
        });
      }}
    >
      <BrFieldLabel associatedInputId="demo-3">Radio 3</BrFieldLabel>
    </BrRadio>
  </BrField>
</BrContainer>
```

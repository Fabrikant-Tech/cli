The slider component can be controlled via the `value` prop and managing state with the `valueChange` event.

```jsx live noInline
function ControlledExample() {
  const [value, setValue] = useState({ sliderValue: 0 });

  const handleChange = (event) => {
    setValue(event.detail.value);
  };

  return (
    <BrSlider step="5" value={value} min="-25" max="25" onValueChange={handleChange}>
      <BrSliderThumb min="-15" max="15" rangeName="sliderValue" position="min" />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  );
}

render(<ControlledExample />);
```

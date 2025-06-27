```jsx live
<BrContainer direction="column" verticalGap="16px">
  <BrField fullWidth={true}>
    <span>Large</span>
    <BrSlider size="Large" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
  <BrField fullWidth={true}>
    <span>Normal</span>
    <BrSlider size="Normal" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
  <BrField fullWidth={true}>
    <span>Small</span>
    <BrSlider size="Small" step="5" value={{ sliderValue: 0 }} min="-50" max="50">
      <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
      <BrSliderTrack associatedRangeName="sliderValue" />
      <BrSliderLegend slot="legend" />
    </BrSlider>
  </BrField>
</BrContainer>
```

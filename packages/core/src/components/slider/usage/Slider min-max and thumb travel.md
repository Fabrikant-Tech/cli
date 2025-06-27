The slider thumb travel can be set separately from the min/max of the slider itself. In this example, the slider is set between -25 and 25. The thumb travel is limited to between -15 and 15.

```jsx live
<BrSlider step="5" value={{ sliderValue: 0 }} min="-25" max="25">
  <BrSliderThumb min="-15" max="15" rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend slot="legend" />
</BrSlider>
```

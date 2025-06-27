A Slider is composed of the parent Slider component, the Slider thumb, the Slider track (which dynamically highlights the track based on track value), and the Slider legend.

To create a Slider, create a key/value object for the Slider `value`, and reference this key for the Slider thumb `rangeName` and the Slider track `associatedRangeName` props. Use the `legend` slot for the Slider legend.

```jsx live
<BrSlider step="5" value={{ sliderValue: 15 }} min="-50" max="50">
  <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend slot="legend" />
</BrSlider>
```

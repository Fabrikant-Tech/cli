- `step` is a slider prop that defines the increment when dragging the thumb or using the arrow keys.
- `largeStep` is a slider prop that defines the increment when holding shift and using the arrow keys.
- `labelStep` is a slider legend prop that defines the interval for the label display. If undefined, it uses the value of the slider `step` plop.

In this example, `step="5"`, `largeStep="10"`, and `labelStep="20"`

```jsx live
<BrSlider step="5" largeStep="10" value={{ sliderValue: 0 }} min="-60" max="60">
  <BrSliderThumb rangeName={'sliderValue'} position={'min'} />
  <BrSliderTrack associatedRangeName="sliderValue" />
  <BrSliderLegend labelStep="20" slot="legend" />
</BrSlider>
```

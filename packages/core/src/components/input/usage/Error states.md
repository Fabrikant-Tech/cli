Clear each input example to show its error state.

```jsx live
<BrContainer verticalGap="16px" direction="column">
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="tooltip"
    value="Tooltip"
  />
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="inline"
    value="Inline"
  />
  <BrInput
    required={true}
    width="240px"
    invalidAfterTouch={false}
    showClearButton={true}
    errorDisplayType="inlineTooltip"
    value="Inline tooltip"
  />
</BrContainer>
```

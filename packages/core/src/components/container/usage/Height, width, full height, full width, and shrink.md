`height` and `width` controls are set as pixels or percent of the parent container. Use `fullHeight` and `fullWidth` to take up the full available space within the parent.

If `shrink` is set to `false` and controls are set to `%`, the container's height or width is determined as a percentage of the parent component's size. If `shrink` is set to `true`, the container adjusts its size to account for space occupied by sibling components.

```jsx live
<BrContainer
  direction="row"
  width="320px"
  height="160px"
  elevation="1"
  horizontalGap="16px"
  padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
>
  <BrContainer width="40px" height="60px" elevation="1"></BrContainer>
  <BrContainer width="60px" height="80%" elevation="1"></BrContainer>
  <BrContainer fullWidth={true} fullHeight={true} shrink={true} elevation="1"></BrContainer>
</BrContainer>
```

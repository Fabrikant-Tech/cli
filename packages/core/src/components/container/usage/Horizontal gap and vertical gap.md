`horizontalGap` and `verticalGap` set its respective gap between each element within the container.

```jsx live
<BrContainer direction="row" horizontalGap="48px">
  <BrContainer
    direction="column"
    width="120px"
    height="120px"
    verticalGap="12px"
    padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
  >
    <BrContainer width="100px" height="20px" elevation="1"></BrContainer>
    <BrContainer width="100px" height="20px" elevation="1"></BrContainer>
    <BrContainer width="100px" height="20px" elevation="1"></BrContainer>
    <BrContainer width="100px" height="20px" elevation="1"></BrContainer>
  </BrContainer>
  <BrContainer
    direction="row"
    width="120px"
    height="120px"
    horizontalGap="24px"
    padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
  >
    <BrContainer width="20px" height="100px" elevation="1"></BrContainer>
    <BrContainer width="20px" height="100px" elevation="1"></BrContainer>
    <BrContainer width="20px" height="100px" elevation="1"></BrContainer>
    <BrContainer width="20px" height="100px" elevation="1"></BrContainer>
  </BrContainer>
</BrContainer>
```

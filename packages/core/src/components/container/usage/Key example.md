```jsx live
<BrContainer
  padding={{ left: '20px', top: '20px', right: '20px', bottom: '20px' }}
  direction="column"
  directionAlignment="center"
  secondaryAlignment="center"
  elevation="1"
>
  <span>Parent container</span>
  <BrContainer
    width="340px"
    height="160px"
    directionAlignment="center"
    secondaryAlignment="center"
    elevation="1"
  >
    <span>Top container</span>
  </BrContainer>
  <BrContainer
    padding={{ left: '20px', top: '20px', right: '20px', bottom: '20px' }}
    horizontalGap="20px"
    directionAlignment="center"
    secondaryAlignment="center"
    direction="row"
    elevation="1"
  >
    <BrContainer
      width="140px"
      height="140px"
      directionAlignment="center"
      secondaryAlignment="center"
      direction="row"
      elevation="1"
    >
      <span>Bottom left</span>
    </BrContainer>
    <BrContainer
      width="140px"
      height="140px"
      directionAlignment="center"
      secondaryAlignment="center"
      direction="row"
      elevation="1"
    >
      <span>Bottom right</span>
    </BrContainer>
  </BrContainer>
</BrContainer>
```

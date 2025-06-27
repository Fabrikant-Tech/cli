`direction` sets the content flow to either `row` or `column`.

```jsx live
<BrContainer
  direction="column"
  padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
  elevation="1"
>
  <BrContainer
    direction="row"
    horizontalGap="8px"
    padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
    elevation="1"
  >
    <BrContainer
      directionAlignment="center"
      secondaryAlignment="center"
      width="64px"
      height="64px"
      backgroundColor={{ color: 'Neutral', opacity: '0.2' }}
    >
      <span>1</span>
    </BrContainer>
    <BrContainer
      directionAlignment="center"
      secondaryAlignment="center"
      width="64px"
      height="64px"
      backgroundColor={{ color: 'Neutral', opacity: '0.2' }}
    >
      <span>2</span>
    </BrContainer>
  </BrContainer>
  <BrContainer
    direction="row"
    horizontalGap="8px"
    padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
    elevation="1"
  >
    <BrContainer
      directionAlignment="center"
      secondaryAlignment="center"
      width="64px"
      height="64px"
      backgroundColor={{ color: 'Neutral', opacity: '0.2' }}
    >
      <span>3</span>
    </BrContainer>
    <BrContainer
      directionAlignment="center"
      secondaryAlignment="center"
      width="64px"
      height="64px"
      backgroundColor={{ color: 'Neutral', opacity: '0.2' }}
    >
      <span>4</span>
    </BrContainer>
  </BrContainer>
</BrContainer>
```

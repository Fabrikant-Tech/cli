`backgroundColor` sets the color and opacity of the container. `textColor` sets the color for text within the container.

```jsx live
<BrContainer direction="row" horizontalGap="10px">
  <BrContainer
    width="195px"
    height="100px"
    backgroundColor={{ color: 'Constructive-500', opacity: '1.0' }}
    textColor={{ color: 'White' }}
    directionAlignment="center"
    secondaryAlignment="center"
  >
    <span>This text is white</span>
  </BrContainer>
  <BrContainer
    width="195px"
    height="100px"
    backgroundColor={{ color: 'Destructive-500', opacity: '0.1' }}
    textColor={{ color: 'Black' }}
    directionAlignment="center"
    secondaryAlignment="center"
  >
    <span>This text is black</span>
  </BrContainer>
</BrContainer>
```

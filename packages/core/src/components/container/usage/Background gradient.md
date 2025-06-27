`backgroundGradient` applies a gradient to the container background color. The gradient can be linear, radial, or conic.

```jsx live
<BrContainer
  height="200px"
  width="400px"
  backgroundGradient={{
    type: 'linear',
    startingPoint: {
      degrees: 45,
    },
    steps: [
      {
        position: 0,
        opacity: '0.5',
        color: 'Destructive',
      },
      {
        position: 100,
        opacity: '1',
        color: 'Constructive',
      },
    ],
  }}
  textColor={{ color: 'White' }}
  directionAlignment="center"
  secondaryAlignment="center"
>
  <span>Linear gradient from Destructive to Constructive</span>
</BrContainer>
```

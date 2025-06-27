The box model values for `margin` and `padding` are set as pixel width or percent of the container.

```jsx live
<BrContainer backgroundColor={{ color: 'Neutral-500', opacity: '1' }}>
  <BrContainer
    padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
    margin={{ left: '12px', top: '12px', right: '12px', bottom: '12px' }}
    backgroundColor={{ color: 'Constructive-500', opacity: '1' }}
  >
    <BrContainer
      width="100px"
      height="100px"
      backgroundColor={{ color: 'White', opacity: '1' }}
    ></BrContainer>
  </BrContainer>
</BrContainer>
```

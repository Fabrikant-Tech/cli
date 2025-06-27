`elevation` defines the elevation shadow. In contrast to `border`, the elevation shadow does not take up space in the box model. `elevation` can take a value, or an array of objects with each object defining a custom elevation pattern.

```jsx live
<BrContainer direction="row" horizontalGap="16px">
  <BrContainer width="100px" height="100px" elevation="1"></BrContainer>
  <BrContainer width="100px" height="100px" elevation="4"></BrContainer>
  <BrContainer
    width="100px"
    height="100px"
    elevation={[
      {
        x: '4px',
        y: '4px',
        blur: '2px',
        spread: '2px',
        color: 'Destructive-500',
        opacity: '1',
      },
    ]}
  ></BrContainer>
</BrContainer>
```

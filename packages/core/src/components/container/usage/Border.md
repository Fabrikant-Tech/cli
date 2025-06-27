`border` sets a value for the component border. Note, in contrast to `elevation`, the border prop takes up width in the box model.

```jsx live
<BrContainer direction="row" horizontalGap="16px">
  <BrContainer
    width="100px"
    height="100px"
    border={{ type: 'solid', width: '1px', color: 'primary' }}
  ></BrContainer>
  <BrContainer
    width="100px"
    height="100px"
    border={{ type: 'dashed', width: '2px', color: 'constructive' }}
  ></BrContainer>
  <BrContainer
    width="100px"
    height="100px"
    border={{ type: 'dotted', width: '4px', color: 'neutral' }}
  ></BrContainer>
</BrContainer>
```

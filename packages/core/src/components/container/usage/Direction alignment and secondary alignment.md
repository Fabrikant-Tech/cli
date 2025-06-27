`directionAlignment` controls alignment for the orientation set by the `direction` prop. `secondaryAlignment` controls alignment in the orthogonal direction.

In the following examples, the parent containers are set to `row`; `directionAlignment` controls the horizontal spacing of each of the vertical bars. `secondaryAlignment` controls the vertical arrangement.

#### Direction alignment examples for row direction:

```jsx live
<BrContainer direction="row" verticalGap="16px" horizontalGap="16px" wrap={true}>
  <BrField>
    <span>Start alignment</span>
    <BrContainer
      directionAlignment="start"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Center alignment</span>
    <BrContainer
      directionAlignment="center"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>End alignment</span>
    <BrContainer
      directionAlignment="end"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Space around</span>
    <BrContainer
      directionAlignment="space-around"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Space between</span>
    <BrContainer
      directionAlignment="space-between"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Space evenly</span>
    <BrContainer
      directionAlignment="space-evenly"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Stretch</span>
    <BrContainer
      directionAlignment="stretch"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
</BrContainer>
```

#### Secondary alignment examples for row direction:

Note, setting the parent container's secondary alignment to `stretch` stretches the child components to fit the parent container. This only affects child components whose height is not set.

```jsx live
<BrContainer direction="row" verticalGap="16px" horizontalGap="16px" wrap={true}>
  <BrField>
    <span>Start alignment</span>
    <BrContainer
      secondaryAlignment="start"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Center alignment</span>
    <BrContainer
      secondaryAlignment="center"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>End alignment</span>
    <BrContainer
      secondaryAlignment="end"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        height="64px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="72px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="48px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
  <BrField>
    <span>Stretch</span>
    <BrContainer
      secondaryAlignment="stretch"
      height="160px"
      direction="row"
      width="240px"
      padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
      horizontalGap="8px"
      elevation="2"
    >
      <BrContainer
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
      <BrContainer
        height="96px"
        width="24px"
        direction="row"
        padding={{ left: '8px', top: '8px', right: '8px', bottom: '8px' }}
        elevation="1"
      ></BrContainer>
    </BrContainer>
  </BrField>
</BrContainer>
```

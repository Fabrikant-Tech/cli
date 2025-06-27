```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay contentAlignment="Left">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment left</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay contentAlignment="Right">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment right</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay contentAlignment="Center">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Alignment centered (default)</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```

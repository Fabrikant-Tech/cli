```jsx live
<BrContainer direction="Column" verticalGap="16px">
  <BrInfoDisplay width="480px">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">480 pixels width</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay width="50%">
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Width set to 50%</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
  <BrInfoDisplay fullWidth={true}>
    <BrIcon slot="decoration" iconName="Book" />
    <span slot="title">Full width</span>
    <span slot="message">Info display message.</span>
    <BrButton slot="actions" colorType="Neutral">
      <span>OK</span>
    </BrButton>
  </BrInfoDisplay>
</BrContainer>
```

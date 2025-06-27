```jsx live
<BrBanner isOpen={true}>
  <BrIcon slot="icon" iconName="Book" />
  <span slot="title">Banner title</span>
  <span slot="description">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacinia faucibus mi a posuere.
    Morbi at augue sed urna aliquam elementum. Vivamus auctor tincidunt urna, tincidunt rhoncus arcu
    aliquam tempor.
  </span>
  <BrButton slot="title-actions">Title action</BrButton>
  <BrButton slot="body-actions">Accept</BrButton>
  <BrButton slot="body-actions" fillStyle="Ghost" colorType="Destructive">
    Cancel
  </BrButton>
</BrBanner>
```

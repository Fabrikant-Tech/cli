<BrTabList
onValueChange={(e) => (document.querySelector('br-tab-content').setAttribute('value', e.detail.value))}
value="Home"

>

    <BrTabItem value="Home">Home</BrTabItem>
    <BrTabItem value="Dashboard">Dashboard</BrTabItem>
    <BrTabItem value="Settings">Settings</BrTabItem>

</BrTabList>
<BrTabContent value="Home">
    <BrTabPanel value="Home">
        <span>Home content</span>
    </BrTabPanel>
    <BrTabPanel value="Dashboard">
        <span>Dashboard content</span>
    </BrTabPanel>
    <BrTabPanel value="Settings">
        <span>Settings content</span>
    </BrTabPanel>
</BrTabContent>

```
export default function TabExample() {
  const [value, setValue] = React.useState("Home");

  return (
    <>
      <BrTabList onValueChange={(e) => setValue(e.detail.value)} value={value}>
        <BrTabItem value="Home">Home</BrTabItem>
        <BrTabItem value="Dashboard">Dashboard</BrTabItem>
        <BrTabItem value="Settings">Settings</BrTabItem>
      </BrTabList>

      <BrTabContent value={value}>
        <BrTabPanel value="Home">
          <span>Home content</span>
        </BrTabPanel>
        <BrTabPanel value="Dashboard">
          <span>Dashboard content</span>
        </BrTabPanel>
        <BrTabPanel value="Settings">
          <span>Settings content</span>
        </BrTabPanel>
      </BrTabContent>
    </>
  );
}
```

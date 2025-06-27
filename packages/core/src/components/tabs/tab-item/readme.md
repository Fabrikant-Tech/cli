# Tab item

<!-- Auto Generated Below -->


## Overview

The Tab Item is the child component of the Tab List. Users select the Tab Item to display the corresponding Tab Content.

## Usage

### Key example

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



## Properties

| Property                | Attribute                  | Description                                                                              | Type                                                                                        | Default                        |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------ |
| `active`                | `active`                   | Determines if the component is displayed in its active state.                            | `boolean \| undefined`                                                                      | `undefined`                    |
| `alignContentToMargins` | `align-content-to-margins` | Whether the content of the component is aligned to the component margins.                | `boolean \| undefined`                                                                      | `false`                        |
| `contentAlignment`      | `content-alignment`        | Determines the component's content alignment.                                            | `"Center" \| "Left" \| "Right"`                                                             | `'Center'`                     |
| `direction`             | `direction`                | Determines the direction the content is displayed in the component.                      | `"horizontal" \| "vertical"`                                                                | `'horizontal'`                 |
| `disabled`              | `disabled`                 | Determines if the component is displayed in its disabled state.                          | `boolean \| undefined`                                                                      | `undefined`                    |
| `ellipsis`              | `ellipsis`                 | Determines if the component displays an ellipsis when the text does not fit the wrapper. | `boolean \| undefined`                                                                      | `false`                        |
| `fullHeight`            | `full-height`              | Determines if the component expands to fill the available vertical space.                | `boolean \| undefined`                                                                      | `undefined`                    |
| `fullWidth`             | `full-width`               | Determines if the component expands to fill the available horizontal space.              | `boolean \| undefined`                                                                      | `undefined`                    |
| `height`                | `height`                   | The height in px or percentage. Token variables and calc strings are also supported.     | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                    |
| `hover`                 | `hover`                    | Determines if the component is displayed in its hover state.                             | `boolean \| undefined`                                                                      | `undefined`                    |
| `internalId`            | `internal-id`              | The unique internal ID of the component.                                                 | `string`                                                                                    | `` `br-tab-item-${tabId++}` `` |
| `showLine`              | `show-line`                | Determines if the tab displays a line under the label.                                   | `boolean`                                                                                   | `true`                         |
| `size`                  | `size`                     | Defines the size style applied to the component.                                         | `"Large" \| "Normal" \| "Small" \| "Xsmall"`                                                | `'Normal'`                     |
| `square`                | `square`                   | Determines if the component is displayed with a width equal to its height.               | `boolean \| undefined`                                                                      | `undefined`                    |
| `theme`                 | `theme`                    | Defines the theme of the component.                                                      | `"Dark" \| "Light"`                                                                         | `ThemeDefault`                 |
| `value`                 | `value`                    | Defines the value of the component.                                                      | `string \| undefined`                                                                       | `undefined`                    |
| `width`                 | `width`                    | The width in px or percentage. Token variables and calc strings are also supported.      | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `undefined`                    |


## Events

| Event         | Description                                                                        | Type                                           |
| ------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `valueChange` | Emits an event whenever the value changes, similar to how onChange works in React. | `CustomEvent<{ value: string \| undefined; }>` |


## Slots

| Slot           | Description                                    |
| -------------- | ---------------------------------------------- |
|                | Passes the tab item label.                     |
| `"left-icon"`  | Passes the left icon.                          |
| `"progress"`   | Passes the progress component to the tab item. |
| `"right-icon"` | Passes the right icon.                         |


----------------------------------------------



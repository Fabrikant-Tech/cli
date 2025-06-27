---
label: Quickstart
slug: /
sidebar_position: 0
---

# Quickstart

This page will explain how to get started using the Brandonten design system.

## Installation

Brandonten is published as a private npm package only available to your organization. To install your package, ensure your `.npmrc` file is setup with the auth token from the security section of your [profile page](https://view-builder.designbase.com/profile).

Your `.npmrc` file should look like this:

```
//repository.designbase.com/:_authToken={YOUR_TOKEN}
@brandonten:registry=https://repository.designbase.com
```

Run the following commands to install the package.

```sh
npm install @brandonten/brandonten-core
npm install @brandonten/brandonten-react
```

If your project uses Next.js, update your `next.config.ts` file by adding the `transpilePackages` option.

```ts
const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@brandonten/brandonten-core', '@brandonten/brandonten-react'],
};
```

After the packages are installed, you can start applying styles and building with Brandonten components.

## Styling

To ensure the styles for your design system are loaded, you should import the stylesheet that is provided with the core package.

In a CSS file, you can use the `@import` directive:

```css
@import '@brandonten/brandonten-core/dist/core/core.css';
```

If you're using a bundler like Webpack or Rollup, you may also be able to import the CSS file in a JSX/TSX file.

```tsx
import '@brandonten/brandonten-core/dist/core/core.css';
```

## Concepts

Brandonten components are built on top of native web technologies ([Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), and [Slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)) that can be used anywhere. If you're coming from a React background, you may not be immediately familiar with these concepts, but they are important to understand to use the design system effectively.

### Props

Props are input arguments that can be passed to components. Props are specific to an individual component. They define a component's behavior and appearance.

The following example displays a button using the `Ghost` fill style via the `fillStyle` prop.

```jsx live
<BrButton fillStyle="Ghost">
  <span>Ghost</span>
</BrButton>
```

### Events

Components may emit events to let other components know something has happened like a value changing or the user moving their mouse over an element.

The following example alerts the user on click.

```jsx live
<BrButton onClick={() => window.alert("You've been alerted!")}>
  <span>Alert me</span>
</BrButton>
```

In React, events are converted to callbacks, so `onClick` is automatically available.

### Methods

Components may expose methods that can be used to manipulate the component or to trigger actions.

The following example uses the `toggleElement` method on the Accordion component to hide an element on a page if the accordion is open.

```jsx live noInline
function MethodExample() {
  const accordionRef = useRef(null);
  const handleClick = () => {
    accordionRef.current?.toggleElement();
  };
  return (
    <>
      <BrButton onClick={handleClick}>
        <span>Click to toggle</span>
      </BrButton>
      <BrAccordion ref={accordionRef}>
        <span>Accordion content</span>
      </BrAccordion>
    </>
  );
}

render(<MethodExample />);
```

### Slots

Components may expose [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots) that can be used to display content. Slots determine where the content is rendered. Most components have at least a "default" or unnamed slot, which is most comparable to the concept of [`children`](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) in React. Components may expose additional named slots for inserting content within a specific place in the component, like the `left-icon` or `right-icon` slots of the Button component.

The following example uses the default Button slot to display a label (the `<span>`) and the `left-icon` slot to display an icon.

```jsx live
<BrButton>
  <BrIcon slot="left-icon" iconName="ChevronLeft" />
  <span>Go back</span>
</BrButton>
```

### Themes

Brandonten includes both a light theme and a dark theme. Components will inherit their theme from the nearest `BrThemeContext` component wrapping it.

```jsx live
<>
  <BrThemeContext theme="Light">
    <BrButton colorType="Neutral">
      <span>Light theme</span>
    </BrButton>
  </BrThemeContext>
  <BrThemeContext theme="Dark">
    <BrButton colorType="Neutral">
      <span>Dark theme</span>
    </BrButton>
  </BrThemeContext>
</>
```

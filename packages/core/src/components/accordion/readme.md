# Accordion

<!-- Auto Generated Below -->


## Overview

The Accordion is an interactive component that enables a user to toggle between hiding and displaying a piece of short form content.

## Usage

### Key example

```jsx live noInline
function KeyExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <BrButton onClick={() => setIsOpen((isOpen) => !isOpen)}>Toggle Accordion</BrButton>
      <BrAccordion isOpen={isOpen}>
        <BrContainer
          width="320px"
          height="240px"
          border={{ type: 'solid', width: '1px', color: 'neutral' }}
          directionAlignment="center"
          secondaryAlignment="center"
        >
          <span>Accordion content</span>
        </BrContainer>
      </BrAccordion>
    </>
  );
}

render(<KeyExample />);
```



## Properties

| Property    | Attribute    | Description                                                                         | Type                                                                                        | Default     |
| ----------- | ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `animated`  | `animated`   | Whether the element should animate or not.                                          | `boolean \| undefined`                                                                      | `true`      |
| `fullWidth` | `full-width` | Determines if the component expands to fill the available horizontal space.         | `boolean \| undefined`                                                                      | `undefined` |
| `isOpen`    | `is-open`    | Determines if the component is open.                                                | `boolean`                                                                                   | `false`     |
| `width`     | `width`      | The width in px or percentage. Token variables and calc strings are also supported. | `` `${number}%` \| `${number}px` \| `calc(${string})` \| `var(--${string})` \| undefined `` | `'100%'`    |


## Events

| Event   | Description                      | Type                |
| ------- | -------------------------------- | ------------------- |
| `close` | Emits when the Accordion closes. | `CustomEvent<void>` |
| `open`  | Emits when the Accordion opens.  | `CustomEvent<void>` |


## Methods

### `closeElement() => Promise<void>`

Closes the Accordion.

#### Returns

Type: `Promise<void>`



### `openElement() => Promise<void>`

Opens the Accordion.

#### Returns

Type: `Promise<void>`



### `toggleElement() => Promise<void>`

Toggles the Accordion open state.

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                      |
| ---- | -------------------------------- |
|      | Passes content to the Accordion. |


----------------------------------------------



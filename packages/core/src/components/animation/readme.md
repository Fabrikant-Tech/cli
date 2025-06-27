# Animation portal



<!-- Auto Generated Below -->


## Overview

The Animation Portal is a utility component for animating elements as they are added or removed from the DOM.

## Properties

| Property                     | Attribute                      | Description                                                 | Type                                                                                                                  | Default                                   |
| ---------------------------- | ------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `animateIn`                  | `animate-in`                   | Determines if the component animates in after it loads.     | `"immediate" \| boolean`                                                                                              | `true`                                    |
| `animateOut`                 | `animate-out`                  | Determines if the element to be removed is animated out.    | `boolean \| undefined`                                                                                                | `false`                                   |
| `appearAnimation`            | --                             | Determines the appear animation.                            | `CSSKeyframe[] \| undefined`                                                                                          | `undefined`                               |
| `appearAnimationClass`       | `appear-animation-class`       | The css class applied to the appearing component.           | `string`                                                                                                              | `'br-animation-portal-appear'`            |
| `appearAnimationDuration`    | `appear-animation-duration`    | The duration of the appear animation in milliseconds.       | `number`                                                                                                              | `300`                                     |
| `appearAnimationEasing`      | `appear-animation-easing`      | Determines the easing function for appearing animations.    | `` "ease-in" \| "ease-in-out" \| "ease-out" \| "linear" \| `cubic-bezier(${number},${number},${number},${number})` `` | `'ease-in-out'`                           |
| `cancelOpacity`              | `cancel-opacity`               | Determines whether opacity animations should be cancelled.  | `boolean \| undefined`                                                                                                | `undefined`                               |
| `disappearAnimation`         | --                             | Determines the disappear animation.                         | `CSSKeyframe[] \| undefined`                                                                                          | `undefined`                               |
| `disappearAnimationClass`    | `disappear-animation-class`    | The css class applied to the disappearing component.        | `string`                                                                                                              | `'br-animation-portal-disappear'`         |
| `disappearAnimationDuration` | `disappear-animation-duration` | The duration of the disappear animation in milliseconds.    | `number`                                                                                                              | `300`                                     |
| `disappearAnimationEasing`   | `disappear-animation-easing`   | Determines the easing function for disappearing animations. | `` "ease-in" \| "ease-in-out" \| "ease-out" \| "linear" \| `cubic-bezier(${number},${number},${number},${number})` `` | `'ease-in-out'`                           |
| `internalId`                 | `internal-id`                  | The unique internal ID of the component.                    | `string`                                                                                                              | `` `br-animation-portal-${portalId++}` `` |


## Events

| Event                   | Description                                                                                                                                                                                                         | Type                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `animationAppearEnd`    | Emits when the appear animation ends. This event is triggered after the appear animation has completed for an element. It can be used to perform actions that should occur after the element has fully appeared.    | `CustomEvent<void>` |
| `animationDisappearEnd` | Emits when the disappear animation ends. This event is triggered after the disappear animation has completed for an element. It is useful for performing actions after an element has been fully removed from view. | `CustomEvent<void>` |


----------------------------------------------



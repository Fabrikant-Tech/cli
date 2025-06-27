import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';

/**
 * The Input Error Display component alerts a user to input errors. You can use props to customize the error display type or render a custom message using the `message` slot.
 * @category Inputs & Forms
 * @slot icon - A slot to pass the icon of the error display.
 * @slot message - A slot to pass the message of the error display.
 */
@Component({
  tag: 'br-input-error-display',
  styleUrl: './css/input-error-display.css',
  shadow: true,
})
export class InputErrorDisplay implements ComponentInterface {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @order 0
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the type of component to render.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) type!: 'inline' | 'tooltip';
  render() {
    const renderContent = () => {
      if (this.type === 'inline') {
        return (
          <div class="br-input-error-display-wrapper">
            <slot name="icon">
              <br-icon
                size={undefined}
                color={'Destructive'}
                iconName={'TriangleExclamationMark'}
              />
            </slot>
            <span class="br-input-error-display-message">
              <slot name="message"></slot>
            </span>
          </div>
        );
      } else {
        return (
          <br-tooltip portalDestination={'inline'} color={'Destructive'}>
            <div slot="target">
              <slot name="icon">
                <br-icon
                  size={undefined}
                  color={'Destructive'}
                  iconName={'TriangleExclamationMark'}
                />
              </slot>
            </div>
            <br-tooltip-content>
              <span class="br-input-error-display-tooltip-message">
                <slot name="message"></slot>
              </span>
            </br-tooltip-content>
          </br-tooltip>
        );
      }
    };
    return <Host>{renderContent()}</Host>;
  }
}

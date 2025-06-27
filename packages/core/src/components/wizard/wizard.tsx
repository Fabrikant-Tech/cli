import { Component, ComponentInterface, Element, Host, Prop, Watch, h } from '@stencil/core';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
/**
 * The Wizard displays Wizard Items in sequence to show users the steps they have to take to complete a flow.
 * @category Navigation
 * @slot - Passes the Wizard Items to the Wizard.
 */
@Component({
  tag: 'br-wizard',
  styleUrl: 'css/wizard.css',
  shadow: true,
})
export class Wizard implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrWizardElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall' | 'Small'> = 'Normal';
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  @Watch('direction')
  directionChanged(newValue: 'horizontal' | 'vertical') {
    const items = this.elm.querySelectorAll('br-wizard-item');
    if (items) {
      items.forEach((item) => {
        item.parentDirection = newValue;
      });
    }
  }
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;

  componentWillLoad(): Promise<void> | void {
    const items = this.elm.querySelectorAll('br-wizard-item');
    if (items) {
      items.forEach((item) => {
        item.parentDirection = this.direction;
      });
    }
  }
  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

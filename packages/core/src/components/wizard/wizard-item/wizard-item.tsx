import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import { Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Wizard Item displays a step in a Wizard flow.
 * @category Navigation
 * @parent wizard
 * @slot - Passes the wizard item label.
 * @slot icon - Passes the content for the whole icon.
 * @slot finished-icon - Passes the finished icon.
 */

@Component({
  tag: 'br-wizard-item',
  styleUrl: 'css/wizard-item.css',
  shadow: true,
})
export class WizardItem implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrWizardItemElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Stores the parent component direction.
   * @category Appearance
   * @visibility hidden
   */
  @Prop({ reflect: true }) parentDirection: 'horizontal' | 'vertical';
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active: boolean;
  /**
   * Determines if the component is displayed in its finished state.
   * @category State
   */
  @Prop({ reflect: true }) finished: boolean;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall' | 'Small'> = 'Normal';

  render() {
    return (
      <Host>
        <div class="br-wizard-item-divider-left" />
        <div class={{ 'br-wizard-item-content': true, 'br-wizard-item-disabled': this.disabled }}>
          <div class="br-wizard-item-divider-middle">
            <div class="br-wizard-item-divider-middle-left" />
            <div class="br-wizard-item-divider-middle-item-marker" />
            <div class="br-wizard-item-divider-middle-right" />
          </div>
          <div class="br-wizard-item-marker">
            <slot name="finished-icon">
              <br-icon iconName="Checkmark" />
            </slot>
            <slot name="icon"></slot>
          </div>
          <div class="br-wizard-item-label">
            <slot></slot>
          </div>
        </div>
        <div class="br-wizard-item-divider-right" />
      </Host>
    );
  }
}

import { Component, Prop, h, Host } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Key renders a key with a label.
 * @category Display
 * @slot - Passes content to the key.
 */
@Component({
  tag: 'br-key',
  styleUrl: './css/key.css',
  shadow: true,
})
export class Key {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  render() {
    return (
      <Host>
        <div class="br-key-outline"></div>
        <span>
          <slot></slot>
        </span>
      </Host>
    );
  }
}

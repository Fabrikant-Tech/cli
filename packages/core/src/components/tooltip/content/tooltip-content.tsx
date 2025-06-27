import { Component, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Tooltip Content component wraps around the content of popovers to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent tooltip
 * @slot - Passes content to the Tooltip Content.
 */
@Component({
  tag: 'br-tooltip-content',
  styleUrl: './css/tooltip-content.css',
  shadow: true,
})
export class TooltipContent {
  /**
   * Determines if the overflowing content should be displayed.
   * @category Appearance
   */
  @Prop({ reflect: true }) showOverflow: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

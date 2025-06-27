import { Component, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';
/**
 * The Confirmation Content component wraps around the content of confirmations to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent confirmation
 * @slot - Passes content to the Confirmation Content.
 */
@Component({
  tag: 'br-confirmation-content',
  styleUrl: './css/confirmation-content.css',
  shadow: { delegatesFocus: true },
})
export class ConfirmationContent {
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
  /**
   * The max height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() maxHeight: BaseSize<BaseSizes>;
  /**
   * The max width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) maxWidth: BaseSize<BaseSizes>;
  /**
   * Determines if the component should have padding.
   * @category Dimensions
   */
  @Prop({ reflect: true }) noPadding: boolean = false;
  /**
   * Flags if the component is in the root corresponding parent.
   * @visibility hidden
   */
  @Prop({ reflect: true }) root: boolean = false;

  render() {
    return (
      <Host>
        <slot name="confirmation-header"></slot>
        <br-scroll-area
          style={{
            maxHeight: this.maxHeight,
            minWidth: this.maxWidth,
          }}
          overscrollY="contain"
          scrollSnapType="both mandatory"
        >
          <div>
            <slot></slot>
          </div>
        </br-scroll-area>
        <slot name="confirmation-footer"></slot>
      </Host>
    );
  }
}

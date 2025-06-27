import { Component, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';
import { focusFirstFocusableElement } from '../../../utils/utils';
/**
 * The Popover Content component wraps around the content of popovers to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent popover
 * @slot - Passes content to the Popover Content.
 */
@Component({
  tag: 'br-popover-content',
  styleUrl: './css/popover-content.css',
  shadow: { delegatesFocus: true },
})
export class PopoverContent {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrPopoverContentElement;
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
  @Prop() maxWidth: BaseSize<BaseSizes>;
  /**
   * Determines if the component should have padding.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) noPadding: boolean = false;

  private internalFocusOverride = (options?: FocusOptions): void => {
    focusFirstFocusableElement(this.elm, options);
  };

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
  }

  render() {
    return (
      <Host>
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
      </Host>
    );
  }
}

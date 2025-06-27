import { Component, Host, Prop, State, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import {
  BaseHorizontalPosition,
  BasePositionType,
  BaseSize,
  BaseSizes,
  BaseVerticalPosition,
} from '../../../reserved/editor-types';
/**
 * The Drawer Content component wraps around the content of drawers to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent drawer
 * @slot - Passes content to the Drawer Content.
 */
@Component({
  tag: 'br-drawer-content',
  styleUrl: './css/drawer-content.css',
  shadow: { delegatesFocus: true },
})
export class DrawerContent {
  /**
   * Whether the drawer content has scroll.
   */
  @State() hasScroll: boolean = false;
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
  @Prop({ reflect: true }) maxHeight: BaseSize<BaseSizes>;
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
  /**
   * Defines the placement of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) placement: BasePositionType<
    BaseHorizontalPosition | BaseVerticalPosition
  > = 'right';

  render() {
    return (
      <Host
        class={{
          'br-drawer-content-has-scroll': this.hasScroll,
        }}
      >
        <slot name="drawer-header"></slot>
        <br-scroll-area
          style={{
            maxHeight: this.maxHeight,
            maxWidth: this.maxWidth,
            minWidth: this.maxWidth,
          }}
          overscrollY="contain"
          scrollSnapType="both mandatory"
          onRatioChange={(e) => {
            this.hasScroll = e.detail.vertical < 1 && e.detail.vertical !== 0;
          }}
        >
          <div>
            <slot></slot>
          </div>
        </br-scroll-area>
        <slot name="drawer-footer"></slot>
      </Host>
    );
  }
}

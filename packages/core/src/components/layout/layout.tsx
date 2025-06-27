import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { LayoutAlignItems, LayoutDirection, LayoutJustifyContent } from './types/layout-types';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
/**
 * The Layout component enables the creation of layout structures.
 * @category Layout
 * @slot - Passes the layout content.
 */
@Component({
  tag: 'br-layout',
  styleUrl: 'css/layout.css',
  shadow: true,
})
export class Layout implements ComponentInterface {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() theme: Theme = ThemeDefault;
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
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes> = '100%';
  /**
   * Determines the type of scrolling allowed.
   * @category Appearance
   */
  @Prop() allowedScroll: 'horizontal' | 'vertical' | 'any' | false = 'vertical';
  /**
   * Determines the component's direction alignment.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) directionAlignment: LayoutAlignItems | LayoutJustifyContent = 'start';
  /**
   * Determines the component's secondary alignment.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) secondaryAlignment: LayoutAlignItems | LayoutJustifyContent = 'stretch';
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) direction: LayoutDirection = 'column';
  /**
   * Determines whether the component allows the content to wrap.
   * @category Appearance
   * @order 2
   */
  @Prop({ reflect: true }) wrap?: boolean | 'reverse';
  /**
   * Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent.
   * @category Appearance
   * @order 3
   */
  @Prop({ reflect: true }) shrink?: boolean;
  render() {
    const horizontalAlignmentStyling = {
      flexDirection: this.direction,
      alignItems: this.directionAlignment,
      justifyContent: this.secondaryAlignment,
    };
    const verticalAlignmentStyling = {
      flexDirection: this.direction,
      alignItems: this.secondaryAlignment,
      justifyContent: this.directionAlignment,
    };
    const layoutStyling =
      this.direction === 'row' || this.direction === 'row-reverse'
        ? horizontalAlignmentStyling
        : verticalAlignmentStyling;
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
          flexShrink: this.shrink ? '1' : '0',
        }}
      >
        {this.allowedScroll ? (
          <br-scroll-area
            theme={this.theme}
            allowedScroll={this.allowedScroll}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', width: '100%', height: '100%', ...layoutStyling }}>
              <slot></slot>
            </div>
          </br-scroll-area>
        ) : (
          <div style={{ display: 'flex', width: '100%', height: '100%', ...layoutStyling }}>
            <slot></slot>
          </div>
        )}
      </Host>
    );
  }
}

import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
/**
 * The Image component displays an image to users.
 * @category Media
 */
@Component({
  tag: 'br-image',
  styleUrl: './css/image.css',
  shadow: true,
})
export class Image implements ComponentInterface {
  /**
   * Determines the source for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() src: string;
  /**
   * Determines the alt text for the component.
   * @category Accessibility
   * @visibility persistent
   */
  @Prop() alt: string;
  /**
   * Defines the strategy that the component uses to fit the content.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' = 'cover';
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
  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <img draggable={false} src={this.src} alt={this.alt} />
      </Host>
    );
  }
}

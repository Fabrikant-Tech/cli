import { h, Component, Host, Prop } from '@stencil/core';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

/**
 * The Control Group component consolidates a set of components into a single group.
 * @category Layout
 * @slot - Passes the elements to be grouped together.
 */
@Component({
  tag: 'br-control-group',
  styleUrl: './css/control-group.css',
  shadow: true,
})
export class ControlGroup {
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() width?: BaseSize<BaseSizes>;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() height?: BaseSize<BaseSizes>;

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

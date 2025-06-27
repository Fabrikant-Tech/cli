import { Component, Prop, h, Host, ComponentInterface, Element } from '@stencil/core';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';
/**
 * The Aspect ratio component forces elements within it to maintain a specific aspect ratio.
 * @category Layout
 * @slot - Passes content to the Aspect ratio component.
 */
@Component({
  tag: 'br-aspect-ratio',
  styleUrl: './css/aspect-ratio.css',
  shadow: true,
})
export class AspectRatio implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrAspectRatioElement;
  /**
   * The desired aspect ratio, specified as a number (e.g., 16/9 or 4/3).
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() ratio: `${number}/${number}` = '16/9';
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';

  private paddingBottom(): string {
    const [width, height] = this.ratio.split('/').map(Number);
    if (!width || !height) return '56.25%';
    return `${(height / width) * 100}%`;
  }

  componentWillLoad() {
    if (
      this.elm.children.length > 1 &&
      DebugMode.currentDebug &&
      this.elm.closest('br-debug-wrapper')
    ) {
      console.error(
        `ERROR - The aspect ratio component should have a single child. All other elements have been hidden.`,
        this.elm,
      );
    }
  }

  render() {
    return (
      <Host
        style={{
          width: this.width,
        }}
      >
        <div class="aspect-ratio-wrapper" style={{ paddingBottom: this.paddingBottom() }}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}

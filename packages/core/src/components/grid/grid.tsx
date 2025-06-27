import { Component, Host, h, Prop } from '@stencil/core';
import { GridTemplateColumnSize } from './types/grid-types';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
/**
 * The Grid component uses grid items to create layouts for displaying components.
 * @category Layout
 * @slot - Passes Grid items to the Grid component.
 */
@Component({
  tag: 'br-grid',
  styleUrl: './css/grid.css',
  shadow: true,
})
export class Grid {
  /**
   * Defines the grid structure of the component.
   * @category Appearance
   */
  @Prop() templateColumns: GridTemplateColumnSize = `repeat(4, 1fr)`;
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
  /**
   * A tuple box model value for the vertical gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop() verticalGap?: BaseSize<BaseSizes> | undefined;
  /**
   * A tuple box model value for the horizontal gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop() horizontalGap?: BaseSize<BaseSizes> | undefined;
  render() {
    const stringFromTemplateColumns = Array.isArray(this.templateColumns)
      ? this.templateColumns.join(' ')
      : this.templateColumns;
    return (
      <Host
        style={{
          gridTemplateColumns: stringFromTemplateColumns,
          width: this.width,
          height: this.height,
          gap:
            this.verticalGap || this.horizontalGap
              ? `${this.verticalGap || '0px'} ${this.horizontalGap || '0px'}`
              : undefined,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

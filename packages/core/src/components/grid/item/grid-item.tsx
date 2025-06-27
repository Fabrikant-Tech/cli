import { Component, Host, h, Prop } from '@stencil/core';
import { GridRowColumnSize } from './types/grid-item-types';
/**
 * The Grid Items component is passed to a grid. It is used to create grid layouts.
 *
 * Refer to the grid component page for an example of how to use grid items.
 * @category Layout
 * @parent grid
 * @slot - Passes content to the Grid Item.
 */
@Component({
  tag: 'br-grid-item',
  styleUrl: './css/grid-item.css',
  shadow: true,
})
export class GridItem {
  /**
   * Defines the row size of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() gridRow: GridRowColumnSize = 'span 1';
  /**
   * Defines the column size of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() gridColumn: GridRowColumnSize = 'span 1';
  render() {
    return (
      <Host
        style={{
          gridRow: this.gridRow,
          gridColumn: this.gridColumn,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

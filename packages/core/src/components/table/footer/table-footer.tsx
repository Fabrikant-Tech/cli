import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';

/**
 * The table footer component is used to display content at the bottom of a table.
 * @category Display
 * @parent table
 * @slot - Passes the content of the footer.
 */
@Component({
  tag: 'br-table-footer',
  styleUrl: 'css/table-footer.css',
  shadow: true,
})
export class TableFooter implements ComponentInterface {
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

import { Component, ComponentInterface, h, Prop } from '@stencil/core';
import { Size, Theme } from '../../../../generated/types/types';
import { ThemeDefault } from '../../../../generated/types/variables';

/**
 * The Menu Item Separator component is a utility component for separating Menu Items.
 * @category Navigation
 * @parent menu-item
 */
@Component({
  tag: 'br-menu-item-separator',
  styleUrl: 'css/menu-item-separator.css',
  shadow: true,
})
export class MenuItemSeparator implements ComponentInterface {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  render() {
    return <br-separator fullWidth={true} height="1px" theme={this.theme}></br-separator>;
  }
}

import { Component, Element, Host, Prop, h } from '@stencil/core';
import { DRAWER_HEADER_DEFAULT_PROPS } from './types/drawer-header-types';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Drawer Content component wraps around the content of drawers to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent drawer
 * @slot - Passes content to the Drawer Content.
 * @slot content - Passes advanced content to the Drawer Content.
 */
@Component({
  tag: 'br-drawer-header',
  styleUrl: './css/drawer-header.css',
  shadow: { delegatesFocus: true },
})
export class DrawerHeader {
  /**
   * The element that this drawer header is associated with.
   */
  @Element() elm: HTMLBrDrawerHeaderElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the close affordance is displayed.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showCloseButton: boolean = true;

  private handleCloseButton = () => {
    const contentDrawerParent = this.elm.closest('br-drawer-content')?.parentElement;
    const internalId =
      contentDrawerParent?.tagName.toLowerCase() === 'br-drawer'
        ? (contentDrawerParent as HTMLBrDrawerElement).internalId
        : contentDrawerParent?.dataset?.parentDrawerId;
    const drawer = document.body.querySelector(
      `br-drawer[internal-id="${internalId}"]`,
    ) as HTMLBrDrawerElement;
    if (drawer) {
      drawer.closeElement();
    }
  };

  render() {
    return (
      <Host slot="drawer-header">
        <h5>
          <slot></slot>
        </h5>
        <slot name="content"></slot>
        {this.showCloseButton && (
          <br-button
            theme={this.theme}
            colorType={DRAWER_HEADER_DEFAULT_PROPS.closeButtonColorType}
            shape={DRAWER_HEADER_DEFAULT_PROPS.closeButtonShape}
            fillStyle={DRAWER_HEADER_DEFAULT_PROPS.closeButtonFillStyle}
            size={DRAWER_HEADER_DEFAULT_PROPS.closeButtonSize}
            onClick={this.handleCloseButton}
          >
            <br-icon
              slot="left-icon"
              iconName={DRAWER_HEADER_DEFAULT_PROPS.closeButtonIcon}
              focusable={false}
            />
          </br-button>
        )}
      </Host>
    );
  }
}

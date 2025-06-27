import { Component, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Drawer Content component wraps around the content of drawers to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent drawer
 * @slot - Passes content to the Drawer Content.
 */
@Component({
  tag: 'br-drawer-footer',
  styleUrl: './css/drawer-footer.css',
  shadow: { delegatesFocus: true },
})
export class DrawerFooter {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDrawerFooterElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the parent component closes when a click happens inside this component.
   * @category Behavior
   */
  @Prop() clickInsideCloses: boolean = false;

  private handleFooterClick = (event: MouseEvent) => {
    if (event.target !== this.elm) {
      const closestContent = this.elm.closest('br-drawer-content');
      const id = (closestContent?.closest('.br-drawer-content-wrapper') as HTMLElement)?.dataset
        .parentDrawerId;
      if (id) {
        (
          document.body.querySelector(`br-drawer[internal-id="${id}"]`) as HTMLBrDrawerElement
        )?.closeElement();
      }
    }
  };

  render() {
    return (
      <Host slot="drawer-footer" onClick={this.handleFooterClick}>
        <slot></slot>
      </Host>
    );
  }
}

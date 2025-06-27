import { Component, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Confirmation Content component wraps around the content of confirmations to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent confirmation
 * @slot - Passes content to the Confirmation Content.
 */
@Component({
  tag: 'br-confirmation-footer',
  styleUrl: './css/confirmation-footer.css',
  shadow: { delegatesFocus: true },
})
export class ConfirmationFooter {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrConfirmationFooterElement;
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
      const closestContent = this.elm.closest('br-confirmation-content');
      const id = (closestContent?.closest('.br-confirmation-content-wrapper') as HTMLElement)
        ?.dataset.parentConfirmationId;
      if (id) {
        (
          document.body.querySelector(
            `br-confirmation[internal-id="${id}"]`,
          ) as HTMLBrConfirmationElement
        )?.closeElement();
      }
    }
  };

  render() {
    return (
      <Host slot="confirmation-footer" onClick={this.handleFooterClick}>
        <slot></slot>
      </Host>
    );
  }
}

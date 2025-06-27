import { Component, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Dialog Content component wraps around the content of dialogs to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent dialog
 * @slot - Passes content to the Dialog Content.
 */
@Component({
  tag: 'br-dialog-footer',
  styleUrl: './css/dialog-footer.css',
  shadow: { delegatesFocus: true },
})
export class DialogFooter {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDialogFooterElement;
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
      const closestContent = this.elm.closest('br-dialog-content');
      const id = (closestContent?.closest('.br-dialog-content-wrapper') as HTMLElement)?.dataset
        .parentDialogId;
      if (id) {
        (
          document.body.querySelector(`br-dialog[internal-id="${id}"]`) as HTMLBrDialogElement
        )?.closeElement();
      }
    }
  };

  render() {
    return (
      <Host slot="dialog-footer" onClick={this.handleFooterClick}>
        <slot></slot>
      </Host>
    );
  }
}

import { Component, Element, Host, Prop, h } from '@stencil/core';
import { DIALOG_HEADER_DEFAULT_PROPS } from './types/dialog-header-types';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Dialog Content component wraps around the content of dialogs to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent dialog
 * @slot - Passes content to the Dialog Content.
 * @slot content - Passes advanced content to the Drawer Content.
 */
@Component({
  tag: 'br-dialog-header',
  styleUrl: './css/dialog-header.css',
  shadow: { delegatesFocus: true },
})
export class DialogHeader {
  /**
   * The element that this dialog header is associated with.
   */
  @Element() elm: HTMLBrDialogHeaderElement;
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
   * @order 1
   */
  @Prop() showCloseButton: boolean = true;

  private handleCloseButton = () => {
    const contentDialogParent = this.elm.closest('br-dialog-content')?.parentElement;
    const internalId =
      contentDialogParent?.tagName.toLowerCase() === 'br-dialog'
        ? (contentDialogParent as HTMLBrDialogElement).internalId
        : contentDialogParent?.dataset?.parentDialogId;
    const dialog = document.body.querySelector(
      `br-dialog[internal-id="${internalId}"]`,
    ) as HTMLBrDialogElement;
    if (dialog) {
      dialog.closeElement();
    }
  };

  render() {
    return (
      <Host slot="dialog-header">
        <h5>
          <slot></slot>
        </h5>
        <slot name="content"></slot>
        {this.showCloseButton && (
          <br-button
            theme={this.theme}
            colorType={DIALOG_HEADER_DEFAULT_PROPS.closeButtonColorType}
            shape={DIALOG_HEADER_DEFAULT_PROPS.closeButtonShape}
            fillStyle={DIALOG_HEADER_DEFAULT_PROPS.closeButtonFillStyle}
            size={DIALOG_HEADER_DEFAULT_PROPS.closeButtonSize}
            onClick={this.handleCloseButton}
          >
            <br-icon
              slot="left-icon"
              iconName={DIALOG_HEADER_DEFAULT_PROPS.closeButtonIcon}
              focusable={false}
            />
          </br-button>
        )}
      </Host>
    );
  }
}

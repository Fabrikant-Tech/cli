import { Component, Element, Host, Prop, h } from '@stencil/core';
import { CONFIRMATION_HEADER_DEFAULT_PROPS } from './types/confirmation-header-types';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
/**
 * The Confirmation Content component wraps around the content of confirmations to serve as a stable root for conditional rendering.
 * @category Overlays & Modals
 * @parent confirmation
 * @slot - Passes content to the Confirmation Content.
 */
@Component({
  tag: 'br-confirmation-header',
  styleUrl: './css/confirmation-header.css',
  shadow: { delegatesFocus: true },
})
export class ConfirmationHeader {
  /**
   * The element that this confirmation header is associated with.
   */
  @Element() elm: HTMLBrConfirmationHeaderElement;
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
  @Prop() showCloseButton: boolean = false;

  private handleCloseButton = () => {
    const contentConfirmationParent = this.elm.closest('br-confirmation-content')?.parentElement;
    const internalId =
      contentConfirmationParent?.tagName.toLowerCase() === 'br-confirmation'
        ? (contentConfirmationParent as HTMLBrConfirmationElement).internalId
        : contentConfirmationParent?.dataset?.parentConfirmationId;
    const confirmation = document.body.querySelector(
      `br-confirmation[internal-id="${internalId}"]`,
    ) as HTMLBrConfirmationElement;
    if (confirmation) {
      confirmation.closeElement();
    }
  };

  render() {
    return (
      <Host slot="confirmation-header">
        <h5>
          <slot></slot>
        </h5>
        {this.showCloseButton && (
          <br-button
            theme={this.theme}
            colorType={CONFIRMATION_HEADER_DEFAULT_PROPS.closeButtonColorType}
            shape={CONFIRMATION_HEADER_DEFAULT_PROPS.closeButtonShape}
            fillStyle={CONFIRMATION_HEADER_DEFAULT_PROPS.closeButtonFillStyle}
            size={CONFIRMATION_HEADER_DEFAULT_PROPS.closeButtonSize}
            onClick={this.handleCloseButton}
          >
            <br-icon
              slot="left-icon"
              iconName={CONFIRMATION_HEADER_DEFAULT_PROPS.closeButtonIcon}
              focusable={false}
            />
          </br-button>
        )}
      </Host>
    );
  }
}

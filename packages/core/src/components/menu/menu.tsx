import { Component, ComponentInterface, Element, h, Host, Listen } from '@stencil/core';
import { focusFirstFocusableElement, getAllFocusableElements } from '../../utils/utils';

/**
 * The Menu component displays a list of actions or items. It is the parent component of the Menu Item and Menu Nesting components.
 * @category Navigation
 * @slot - Passes the Menu Items to the Menu.
 */
@Component({
  tag: 'br-menu',
  styleUrl: 'css/menu.css',
  shadow: { delegatesFocus: true },
})
export class Menu implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrMenuElement;

  private internalFocusOverride = (options?: FocusOptions): void => {
    focusFirstFocusableElement(this.elm, options);
  };

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    const focusableElements = getAllFocusableElements(document.body).filter(
      (el) => !this.elm.contains(el) || this.elm === el,
    );
    const thisIndex = focusableElements.indexOf(this.elm);
    if (ev.key === 'Tab' && !ev.shiftKey) {
      ev.preventDefault();
      (focusableElements[thisIndex + 1] as globalThis.HTMLElement)?.focus();
    }
    if (ev.key === 'Tab' && ev.shiftKey) {
      ev.preventDefault();
      (focusableElements[thisIndex - 1] as globalThis.HTMLElement)?.focus();
    }
  }

  @Listen('close')
  handleClose() {
    const documentActiveElement = document.activeElement;
    if (!this.elm.contains(documentActiveElement)) {
      setTimeout(() => {
        this.elm.querySelector('br-menu-item')?.focus();
      }, 0);
    }
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, Host, Method, Prop, h } from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { ToastOptions } from './types/toast-types';

// This id increments for all toast providers on the page
let toastProviderId = 0;

/**
 *  The Toast Provider wraps a toast component and gives it CRUD capabilities. It is a required component when using a toast.
 * @category Overlays & Modals
 */
@Component({
  tag: 'br-toast-provider',
  styleUrl: './css/toast-provider.css',
  shadow: { delegatesFocus: true },
})
export class ToastProvider implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrToastProviderElement;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-toast-provider-${toastProviderId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the placement of the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) placement: 'left' | 'right' | 'center' = 'right';
  /**
   * Determines the component's alignment.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) alignment: 'top' | 'bottom' | 'center' = 'bottom';
  /**
   * Determines where the latest toast appears.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) latestTop: boolean = true;
  /**
   * Opens a Toast.
   */
  @Method()
  async open(options: ToastOptions): Promise<HTMLBrToastElement | undefined> {
    const existingToast = this.elm.querySelector(`#${options.id}`);
    if (existingToast) {
      return this.update(options);
    }
    const toast = this.createToast(options);
    this.elm.appendChild(toast);
    return toast;
  }
  /**
   * Updates a toast.
   */
  @Method()
  async update(options: ToastOptions): Promise<HTMLBrToastElement | undefined> {
    const existingToast = this.elm.querySelector(`#${options.id}`);
    if (existingToast) {
      const newToast = this.createToast(options);
      existingToast.replaceWith(newToast);
      newToast.resetTimekeeper(true);
      return newToast;
    }
    return undefined;
  }

  private createToast = (toast: ToastOptions): HTMLBrToastElement => {
    const toastEl = document.createElement('br-toast');
    const toastTitle = document.createElement('span');
    toastTitle.slot = 'title';
    toastTitle.textContent = toast.title;
    toastEl.appendChild(toastTitle);
    if (toast.expiration) {
      toastEl.expiration = toast.expiration;
    }
    if (toast.description) {
      const toastDescription = document.createElement('span');
      toastDescription.textContent = toast.description;
      toastEl.appendChild(toastDescription);
    }
    if (toast.actions) {
      toast.actions.forEach((action) => {
        const button = document.createElement('br-button');
        const span = document.createElement('span');
        span.textContent = action.label;
        button.appendChild(span);
        if (action.iconName) {
          const icon = document.createElement('br-icon');
          icon.iconName = action.iconName;
          icon.slot = 'left-icon';
          button.appendChild(icon);
        }
        button.slot = 'body-actions';
        toastEl.appendChild(button);
      });
    }
    if (toast.iconName) {
      const toastIcon = document.createElement('br-icon');
      toastIcon.slot = 'icon';
      toastIcon.iconName = toast.iconName;
      toastEl.appendChild(toastIcon);
    }
    if (toast.id) {
      toastEl.id = toast.id;
    }
    toastEl.fillStyle = toast.fillStyle;
    toastEl.colorType = toast.colorType;
    toastEl.internalId = this.internalId;
    this.elm.appendChild(toastEl);
    return toastEl;
  };

  render() {
    return (
      <Host>
        <br-scroll-area allowedScroll="vertical" height="100%">
          <div class="br-toast-provider-content">
            <slot></slot>
          </div>
        </br-scroll-area>
      </Host>
    );
  }
}

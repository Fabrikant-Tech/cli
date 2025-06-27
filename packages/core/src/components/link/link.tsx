import { Component, Host, h, Prop, ComponentInterface, Element, Watch } from '@stencil/core';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { isEqual } from 'lodash-es';
import { getSanitizedURL } from './utils/utils';
import { BaseColorType } from '../../reserved/editor-types';

/**
 * The Link component enables users to navigate to a destination URL on click.
 * @category Navigation
 * @slot - Passes the link content.
 */
@Component({
  tag: 'br-link',
  styleUrl: './css/link.css',
  shadow: true,
})
export class Link implements ComponentInterface {
  /**
   * A reference to the anchor element.
   */
  private aRef: HTMLAnchorElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrLinkElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Primary';
  /**
   * Defines whether the link wraps around the content.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) wrapAroundContent: boolean = false;
  /**
   * Determines whether the component should be focusable.
   * @category Behavior
   */
  @Prop() focusable?: boolean = true;
  /**
   * Defines the URL the component navigates to.
   * @category Data
   * @visibility persistent
   */
  @Prop() url?: string;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  @Watch('disabled')
  disabledChanged(newValue: boolean, oldValue: boolean) {
    if (!isEqual(newValue, oldValue)) {
      const a = this.elm.querySelector('a');
      if (a) {
        if (newValue === true) {
          a.setAttribute('disabled', '');
        } else {
          a.removeAttribute('disabled');
        }
      }
    }
  }
  /**
   * Determines where the component opens the URL it navigates to.
   * @category Behavior
   */
  @Prop() target?: '_self' | '_blank' | '_parent' | '_top' = '_self';

  componentWillLoad() {
    setTimeout(() => {
      if (this.aRef) {
        if (this.disabled === true) {
          this.aRef.setAttribute('disabled', '');
        } else {
          this.aRef.removeAttribute('disabled');
        }
      }
    }, 0);
  }

  private resolveFocus = (e: FocusEvent) => {
    if (!this.focusable) {
      e.stopPropagation();
    }
  };

  private resolveBlur = (e: FocusEvent) => {
    if (!this.focusable) {
      e.stopPropagation();
    }
  };

  private resolveClick = (e: MouseEvent) => {
    if (!this.focusable || this.disabled) {
      e.stopPropagation();
    }
  };

  render() {
    return (
      <Host>
        <a
          ref={(ref) => (this.aRef = ref)}
          part="href"
          href={!this.disabled && this.url ? getSanitizedURL(this.url) : undefined}
          tabindex={this.focusable && !this.disabled ? 0 : -1}
          onFocus={this.resolveFocus}
          onBlur={this.resolveBlur}
          onClick={this.resolveClick}
          target={this.target}
        >
          <slot></slot>
        </a>
      </Host>
    );
  }
}

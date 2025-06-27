import { Component, Element, Host, Prop, h, Event, EventEmitter, Method } from '@stencil/core';
import { ColorType, FillStyle, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseColorType, BaseSize, BaseSizes } from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';
/**
 * The Banner component displays information and/or instructions in a container that is dismissible by default. You can use props and slots to create different Banner styles.
 * @category Display
 * @slot icon - Passes an icon to the Banner.
 * @slot title - Passes the title to the Banner.
 * @slot description - Passes a description to the Banner.
 * @slot title-actions - Passes actions to be rendered in the Banner body.
 * @slot body-actions - Passes actions to be rendered in the Banner body.
 */
@Component({
  tag: 'br-banner',
  styleUrl: './css/banner.css',
  shadow: { delegatesFocus: true },
})
export class Banner {
  /**
   * An internal reference to whether the banner is controlled.
   */
  private isControlled: boolean = false;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrBannerElement;
  /**
   * Prop to track if the banner is open.
   * @category State
   * @visibility persistent
   */
  @Prop({ mutable: true, reflect: true }) isOpen: boolean | undefined;
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
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall' | 'Large'> = 'Normal';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) fillStyle: Exclude<FillStyle, 'Ghost'> = 'Solid';
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Primary';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Whether the close affordance is shown, if it is not shown the banner is always visible.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) showCloseButton: boolean = true;
  /**
   * Event that emits when the banner opens.
   */
  @Event() open!: EventEmitter<void>;
  /**
   * Event that emits when the banner closes.
   */
  @Event() close!: EventEmitter<void>;
  /**
   * A method to open the banner.
   */
  @Method()
  async openElement(): Promise<void> {
    if (this.isControlled) {
      this.open.emit();
    } else {
      this.isOpen = true;
    }
  }
  /**
   * A method to close the banner.
   */
  @Method()
  async closeElement(): Promise<void> {
    if (this.isControlled) {
      this.close.emit();
    } else {
      this.isOpen = false;
    }
  }

  componentWillLoad() {
    this.applyButtonStyles();
    window.addEventListener('popstate', this.cleanupPopstate);
    this.isControlled = this.isOpen !== undefined && this.showCloseButton;
    if (
      this.isControlled &&
      this.showCloseButton &&
      DebugMode.currentDebug &&
      this.elm.closest('br-debug-wrapper')
    ) {
      console.error(`WARNING - This banner is in controlled mode.`, this.elm);
    }
  }

  private cleanupPopstate() {
    this.isControlled = false;
    this.isOpen = undefined;
  }

  private applyButtonStyles = () => {
    this.elm.querySelectorAll('br-button').forEach((button) => {
      button.theme = this.theme;
      if (button.slot === 'title-actions') {
        button.size = 'Small';
      } else {
        button.size = this.size;
      }
      if (button.slot === 'title-actions') {
        button.fillStyle = 'Ghost';
      }
    });
  };

  render() {
    const HeadingTag = (this.size === 'Normal' && 'h5') || 'h6';
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <div class="br-banner-icon">
          <slot name="icon"></slot>
        </div>
        <div class="br-banner-content">
          <div class="br-banner-title">
            <HeadingTag class="br-banner-title-text">
              <slot name="title"></slot>
            </HeadingTag>
          </div>
          <slot name="description"></slot>
          <div class="br-banner-body-actions">
            <slot name="body-actions"></slot>
          </div>
        </div>
        <div class="br-banner-actions">
          <slot name="title-actions" onSlotchange={this.applyButtonStyles}></slot>
          {this.showCloseButton && (
            <br-button
              onClick={() => this.closeElement()}
              colorType={this.colorType}
              fillStyle="Ghost"
              size="Small"
              theme={this.theme}
            >
              <br-icon slot="left-icon" iconName="Cross" />
            </br-button>
          )}
        </div>
      </Host>
    );
  }
}

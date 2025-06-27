import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';
import { ColorType, FillStyle, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseColorType } from '../../../reserved/editor-types';

// This id increments for all toast providers on the page
let toastId = 0;

/**
 * The Toast component is a small message that pops up at the bottom of the screen. It is often used to provide quick status updates.
 *
 * Refer to examples to explore different toast styles and behaviors.
 * @category Overlays & Modals
 * @parent toast-provider
 * @slot icon - Passes an icon to the Toast.
 * @slot title - Passes a title to the Toast.
 * @slot - Passes a description for the Toast.
 * @slot title-actions - Passes actions for the Toast title.
 * @slot body-actions - Passes actions for the Toast.
 */
@Component({
  tag: 'br-toast',
  styleUrl: './css/toast.css',
  shadow: { delegatesFocus: true },
})
export class Toast implements ComponentInterface {
  /**
   * A reference to the timer that controls the expiration of the Toast.
   */
  private timekeeper: number | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrToastElement;
  /**
   * Tracks if the toast has actions.
   */
  @State() hasActions: boolean | null = null;
  /**
   * Tracks if the toast has a description.
   */
  @State() hasDescription: boolean | null = null;
  /**
   * The time that has passed since the Toast was created.
   */
  @State() passedTime: number = 0;
  /**
   * Whether the Toast is hidden.
   */
  @State() isHidden: boolean = false;
  /**
   * Whether the Toast is being hovered over.
   */
  @State() isBeingHovered: boolean;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-toast-${toastId++}`;
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
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Neutral';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Solid';
  /**
   * Determines the component's expiration time.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() expiration: number | 'none' = 3000;
  /**
   * Event that emits when the toast opens.
   */
  @Event() open!: EventEmitter<void>;
  /**
   * Event that emits when the toast closes.
   */
  @Event() close!: EventEmitter<void>;
  /**
   * Restarts the timekeeper.
   */
  @Method()
  async resetTimekeeper(restart: boolean): Promise<void> {
    this.isBeingHovered = true;
    if (typeof this.expiration === 'number') {
      window.clearInterval(this.timekeeper);
      this.passedTime = 0;
    }
    if (restart) {
      this.restart();
    }
  }
  /**
   * Closes the Toast.
   */
  @Method()
  async closeElement(): Promise<void> {
    window.removeEventListener('blur', this.resolveWindowBlur);
    window.removeEventListener('focus', this.resolveWindowFocus);
    if (this.timekeeper) {
      window.clearInterval(this.timekeeper);
    }
    this.isHidden = true;
    this.close.emit();
  }

  private restart() {
    this.isBeingHovered = false;
    if (typeof this.expiration === 'number') {
      this.timekeeper = window.setInterval(this.passTime, 100);
    }
  }

  private passTime = () => {
    if (typeof this.expiration === 'number') {
      if (this.passedTime < this.expiration) {
        this.passedTime = this.passedTime + 100;
      } else if ((this.passedTime = this.expiration)) {
        this.closeElement();
      }
    }
  };

  connectedCallback() {
    window.addEventListener('blur', this.resolveWindowBlur);
    window.addEventListener('focus', this.resolveWindowFocus);
    if (this.expiration) {
      this.timekeeper = window.setInterval(this.passTime, 100);
    }
    this.open.emit();
  }

  componentWillLoad() {
    this.applyButtonStyles();
    this.setContentFlags();
  }

  disconnectedCallback() {
    if (this.timekeeper) {
      window.clearInterval(this.timekeeper);
    }
  }

  private resolveWindowBlur = () => this.resetTimekeeper(false);
  private resolveWindowFocus = () => this.resetTimekeeper(true);

  private resolveMouseOver = () => {
    this.resetTimekeeper(false);
  };

  private resolveMouseOut = () => {
    this.resetTimekeeper(true);
  };

  private applyButtonStyles = () => {
    this.setContentFlags();
    this.elm.querySelectorAll('br-button').forEach((button) => {
      button.theme = this.theme;
      button.size = 'Small';
    });
  };

  private setContentFlags = () => {
    this.hasDescription = this.elm?.querySelector('*:not([slot])') !== null ? true : null;
    this.hasActions = this.elm?.querySelector('*[slot="body-actions"]') !== null ? true : null;
  };

  render() {
    const HeadingTag = this.size === 'Normal' ? 'h5' : 'h6';
    return (
      <Host class={{ 'br-toast-hidden': this.isHidden }}>
        <div
          class="br-toast-wrapper"
          onMouseEnter={this.resolveMouseOver}
          onMouseLeave={this.resolveMouseOut}
          onFocusin={this.resolveMouseOver}
          onFocusout={this.resolveMouseOut}
        >
          <div class="br-toast-icon">
            <slot name="icon"></slot>
          </div>
          <div class="br-toast-content">
            <div class="br-toast-title">
              <HeadingTag>
                <slot name="title"></slot>
              </HeadingTag>
              <div class="br-toast-title-actions">
                <slot name="title-actions"></slot>
                <br-button
                  colorType={this.fillStyle === 'Ghost' ? this.colorType : 'Neutral'}
                  fillStyle="Ghost"
                  size="Small"
                  theme={this.theme}
                  onClick={() => this.closeElement()}
                >
                  {(this.expiration === 'none' || this.isBeingHovered) && (
                    <br-icon slot="left-icon" iconName="Cross" />
                  )}
                  {this.expiration && this.expiration !== 'none' && !this.isBeingHovered && (
                    <br-progress
                      slot="left-icon"
                      size="Small"
                      shape="Circular"
                      color={this.fillStyle === 'Ghost' ? this.colorType : 'Neutral'}
                      value={this.passedTime || 0}
                      min={0}
                      max={this.expiration}
                    ></br-progress>
                  )}
                </br-button>
              </div>
            </div>
            <div
              class={{
                'br-toast-description': true,
                'br-toast-description-not-empty': this.hasDescription !== null,
              }}
            >
              <slot onSlotchange={this.setContentFlags}></slot>
            </div>
            <div
              class={{
                'br-toast-actions': true,
                'br-toast-actions-not-empty': this.hasActions !== null,
              }}
            >
              <slot name="body-actions" onSlotchange={this.applyButtonStyles}></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

import {
  AttachInternals,
  Component,
  ComponentInterface,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h,
} from '@stencil/core';
import {
  BaseColorType,
  BaseHorizontalAlignment,
  BaseSize,
  BaseSizes,
} from '../../reserved/editor-types';
import {
  ColorType,
  FillStyle,
  HorizontalAlignment,
  Shape,
  Size,
  Theme,
} from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';

// This id increments for all buttons on the page
let buttonId = 0;

/**
 * The Button is an interactive component that users activate via a mouse click or other input. It can be used to submit forms, acknowledge information, or to enable a user to interact with a page in other ways.
 * @category Inputs & Forms
 * @slot - Passes the button label.
 * @slot left-icon - Passes the left icon.
 * @slot right-icon - Passes the right icon.
 * @slot progress - Passes the progress component to the button.
 */
@Component({
  tag: 'br-button',
  styleUrl: './css/button.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class Button implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrButtonElement;
  /**
   * Associates the component to the form.
   */
  @AttachInternals() internals: ElementInternals;
  /**
   * Store whether the progress was added.
   */
  @State() hasProgress: boolean = false;
  /**
   * Store whether the label was added.
   */
  @State() hasLabel: boolean = false;
  /**
   * Store whether the right icon was added.
   */
  @State() hasRightIcon: boolean = false;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-button-${buttonId++}`;
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
   * @order 4
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Primary';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Solid';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Determines the component's content alignment.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true })
  contentAlignment: BaseHorizontalAlignment<HorizontalAlignment> = 'Center';
  /**
   * Whether the content of the component is aligned to the component margins.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) alignContentToMargins?: boolean = false;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active?: boolean;
  /**
   * Determines if the component is displayed in its hover state.
   * @category State
   */
  @Prop({ reflect: true }) hover?: boolean;
  /**
   * Determines if the component displays an ellipsis when the text does not fit the wrapper.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) ellipsis?: boolean = false;
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
   * Determines if the component is displayed with a width equal to its height.
   * @category Dimensions
   * @order 0
   */
  @Prop({ reflect: true }) square?: boolean;
  /**
   * Determines the type associated with the component in a form context.
   * @category Data
   */
  @Prop() type?: 'button' | 'submit' | 'reset' = 'button';
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value?: string | number | string[] | undefined;

  componentWillLoad() {
    this.hasProgress = this.elm.querySelector(':scope > *[slot="progress"]') !== null;
    this.hasLabel =
      this.elm.querySelector(':scope > *:not([slot])') !== null ||
      Array.from(this.elm.childNodes).filter((c) => c.nodeType === 3).length > 0;
    this.hasRightIcon = this.elm.querySelector(':scope > *[slot="right-icon"]') !== null;
  }

  @Listen('click')
  maybeSubmit() {
    if (this.type === 'submit') {
      this.internals.form?.requestSubmit();
    }
  }

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <button
          id={`inner-button-${this.elm.id || this.internalId}`}
          data-active={this.active}
          data-hover={this.hover}
          value={this.value}
          disabled={this.disabled}
          type={this.type}
          class={{
            'br-button-has-progress': this.hasProgress,
            'br-button-has-label': this.hasLabel || this.width !== undefined,
            'br-button-has-right-icon': this.hasRightIcon,
          }}
        >
          <slot name="left-icon" />
          <slot
            onSlotchange={() => {
              this.hasLabel =
                this.elm.querySelector(':scope > *:not([slot])') !== null ||
                Array.from(this.elm.childNodes).filter((c) => c.nodeType === 3).length > 0;
            }}
          />
          <slot
            name="right-icon"
            onSlotchange={() => {
              this.hasRightIcon = this.elm.querySelector(':scope > *[slot="right-icon"]') !== null;
            }}
          />
          <slot
            name="progress"
            onSlotchange={() => {
              this.hasProgress = this.elm.querySelector(':scope > *[slot="progress"]') !== null;
            }}
          />
        </button>
      </Host>
    );
  }
}

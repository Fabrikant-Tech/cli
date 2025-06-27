import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { HorizontalAlignment, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseHorizontalAlignment, BaseSize, BaseSizes } from '../../../reserved/editor-types';

// This id increments for all tab items on the page
let tabId = 0;

/**
 * The Tab Item is the child component of the Tab List. Users select the Tab Item to display the corresponding Tab Content.
 * @category Navigation
 * @parent tab-list
 * @slot - Passes the tab item label.
 * @slot left-icon - Passes the left icon.
 * @slot right-icon - Passes the right icon.
 * @slot progress - Passes the progress component to the tab item.
 */
@Component({
  tag: 'br-tab-item',
  styleUrl: 'css/tab-item.css',
  shadow: { delegatesFocus: true },
})
export class TabIem implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTabItemElement;
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
  @Prop({ reflect: true }) readonly internalId: string = `br-tab-item-${tabId++}`;
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
  @Prop({ reflect: true }) size: Size = 'Normal';
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
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Determines if the component is displayed with a width equal to its height.
   * @category Dimensions
   */
  @Prop({ reflect: true }) square?: boolean;
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value?: string;
  /**
   * Determines if the tab displays a line under the label.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) showLine: boolean = true;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: string | undefined }>;

  componentWillLoad() {
    this.hasProgress = this.elm.querySelector('*[slot="progress"]') !== null;
    this.hasLabel =
      this.elm.querySelector('*:not([slot])') !== null ||
      Array.from(this.elm.childNodes).filter((c) => c.nodeType === 3).length > 0;
    this.hasRightIcon = this.elm.querySelector('*[slot="right-icon"]') !== null;
  }

  private handleClick = () => {
    this.valueChange.emit({ value: this.value });
  };

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        role="tab"
        onClick={this.handleClick}
      >
        <button
          id={`inner-tab-${this.elm.id || this.internalId}`}
          data-active={this.active}
          data-hover={this.hover}
          value={this.value}
          disabled={this.disabled}
          class={{
            'br-tab-item-has-progress': this.hasProgress,
            'br-tab-item-has-label': this.hasLabel || this.width !== undefined,
            'br-tab-item-has-right-icon': this.hasRightIcon,
          }}
        >
          <slot name="left-icon" />
          <slot
            onSlotchange={() => {
              this.hasLabel =
                this.elm.querySelector('*:not([slot])') !== null ||
                Array.from(this.elm.childNodes).filter((c) => c.nodeType === 3).length > 0;
            }}
          />
          <slot
            name="right-icon"
            onSlotchange={() => {
              this.hasRightIcon = this.elm.querySelector('*[slot="right-icon"]') !== null;
            }}
          />
          <slot
            name="progress"
            onSlotchange={() => {
              this.hasProgress = this.elm.querySelector('*[slot="progress"]') !== null;
            }}
          />
        </button>
      </Host>
    );
  }
}

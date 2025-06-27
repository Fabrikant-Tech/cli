import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { Shape, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';

// This id increments for all select items on the page
let selectItemId = 0;

/**
 * The List Item component renders one of the options in a list. A user can select a List Item from a list.
 * @category Inputs & Forms
 * @parent select-list
 * @slot - Passes the label of the List Item.
 * @slot item - Passes custom rendered content to the List Item.
 * @slot left-icon - Passes content on the left side of the List Item.
 * @slot right-icon - Passes content on the right side of the List Item.
 * @slot selected-icon - Passes content into the selected icon affordance of the List Item.
 */
@Component({
  tag: 'br-select-list-item',
  styleUrl: './css/select-list-item.css',
  shadow: true,
})
export class SelectListItem {
  /**
   * A reference to the default button element.
   */
  private buttonRef: HTMLBrButtonElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSelectListItemElement;
  /**
   * The position of the list item relative to other selected items.
   */
  @State() selectionPosition: 'top' | 'middle' | 'bottom' | undefined;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-select-item-${selectItemId++}`;
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
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * The value of the List Item.
   */
  @Prop() label: string;
  /**
   * Defines the value of the component.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() value: any;
  /**
   * Determines if the component is shown in its selected state.
   * @category Appearance
   */
  @Prop({ reflect: true }) selected: boolean;
  @Watch('selected')
  handleSelectedChange(newValue: boolean, oldValue: boolean) {
    const nestedItemTarget = this.elm.querySelector('*[slot="item"]') || this.buttonRef;
    if (newValue !== oldValue && nestedItemTarget) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (nestedItemTarget as any)[this.activePropName || 'hover'] = newValue;
    }
  }
  /**
   * Determines if the component is shown in its keyboard selected state.
   * @category Appearance
   */
  @Prop({ reflect: true }) keyboardSelected: boolean;
  @Watch('keyboardSelected')
  handleKeyboardSelectedChange(newValue: boolean, oldValue: boolean) {
    const nestedItemTarget = this.elm.querySelector('*[slot="item"]') || this.buttonRef;
    if (newValue !== oldValue && nestedItemTarget) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (nestedItemTarget as any)[this.activeKeyboardPropName || 'active'] = newValue;
    }
  }
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
   * Determines the prop to set to true when the element is selected.
   * @category Behavior
   */
  @Prop() activePropName: string = 'hover';
  /**
   * Determines the prop to set to true when the element is selected via the keyboard.
   * @category Behavior
   */
  @Prop() activeKeyboardPropName: string = 'active';
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines if the component is filtered out.
   * @category Behavior
   */
  @Prop({ reflect: true }) filteredOut?: boolean;
  /**
   * Determines the selected values of the parent component.
   * @category Behavior
   * @visibility hidden
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() selectedValue: any[] | undefined;
  @Watch('selectedValue')
  handleSelectedValueChange() {
    setTimeout(() => {
      const selectedAbove = (this.elm.previousSibling as HTMLBrSelectListItemElement)
        ? (this.elm.previousSibling as HTMLBrSelectListItemElement).selected
        : false;
      const selectedBelow = (this.elm.nextSibling as HTMLBrSelectListItemElement)
        ? (this.elm.nextSibling as HTMLBrSelectListItemElement).selected
        : false;

      const stringValue =
        (selectedAbove && selectedBelow && 'middle') ||
        (selectedAbove && 'bottom') ||
        (selectedBelow && 'top') ||
        undefined;
      this.selectionPosition = this.selected ? stringValue : undefined;
    }, 0);
  }
  /**
   * Event that emits when the popover opens.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() select!: EventEmitter<{ value: any }>;

  private handleClick = () => {
    if (!this.disabled) {
      this.select.emit({ value: this.value });
    }
  };

  componentDidLoad() {
    if (this.selected) {
      const nestedItemTarget = this.elm.querySelector('*[slot="item"]') || this.buttonRef;
      if (nestedItemTarget) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (nestedItemTarget as any)[this.activePropName || 'hover'] = true;
      }
    }
  }

  render() {
    return (
      <Host
        onClick={this.handleClick}
        class={{
          'br-select-list-item-top': this.selected && this.selectionPosition === 'top',
          'br-select-list-item-middle': this.selected && this.selectionPosition === 'middle',
          'br-select-list-item-bottom': this.selected && this.selectionPosition === 'bottom',
        }}
        role="option"
        tabindex={-1}
      >
        <slot name="item">
          <br-button
            ref={(ref) => (this.buttonRef = ref)}
            theme={this.theme}
            width={this.width}
            height={this.height}
            fullWidth={this.fullWidth}
            fullHeight={this.fullHeight}
            fillStyle={'Ghost'}
            contentAlignment={'Left'}
            alignContentToMargins={true}
            size={this.size}
            shape={this.shape}
            colorType={this.buttonRef && this.buttonRef.active ? 'Primary' : 'Neutral'}
            disabled={this.disabled}
          >
            <slot name="left-icon" slot="left-icon"></slot>
            <slot>{this.label}</slot>
            <slot name="right-icon" slot="right-icon"></slot>
            <div slot="right-icon">
              <slot name="selected-icon">
                {this.selected ? <br-icon iconName="Checkmark" /> : <br-icon />}
              </slot>
            </div>
          </br-button>
        </slot>
      </Host>
    );
  }
}

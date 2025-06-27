import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { ShortAnimationDuration } from '../../../global/types/roll-ups';
import { Shape, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';

/**
 * The Tree Item component displays an item in a tree component. Reference the Tree documentation for an example.
 * @category Navigation
 * @parent tree
 * @slot - Passes the label for the Tree Item.
 * @slot icon - Passes the icon for the Tree Item.
 * @slot right - Passes any actions on the Tree Item.
 * @slot children - Passes any nested Tree Items.
 */
@Component({
  tag: 'br-tree-item',
  styleUrl: 'css/tree-item.css',
  shadow: true,
})
export class TreeItem implements ComponentInterface {
  /**
   * A reference to the default button element.
   */
  private buttonRef: HTMLBrButtonElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTreeItemElement;
  /**
   * Whether the Accordion should animate.
   */
  @State() shouldAnimate: boolean = false;
  /**
   * Whether the item is last or not.
   */
  @State() isLastItem: boolean = false;
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Whether the tree item is open
   */
  @Prop({ mutable: true, reflect: true }) isOpen: boolean = false;
  @Watch('isOpen')
  isOpenChanged(newValue: boolean) {
    if (newValue) {
      this.open.emit();
    }
  }
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
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
    const nestedItemTarget = this.buttonRef;
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
    const nestedItemTarget = this.buttonRef;
    if (newValue !== oldValue && nestedItemTarget) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (nestedItemTarget as any)[this.activeKeyboardPropName || 'active'] = newValue;
    }
  }
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
   * Emits when the Accordion opens.
   */
  @Event() open: EventEmitter<void>;
  /**
   * Emits when the Accordion closes.
   */
  @Event() close: EventEmitter<void>;
  /**
   * Event that emits when the popover opens.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() select!: EventEmitter<{ value: any }>;

  private handleClick = (e: MouseEvent) => {
    if (!this.disabled) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      this.select.emit({ value: this.value });
    }
  };

  componentWillLoad() {
    if (this.isOpen) {
      this.open.emit();
    }
  }

  componentDidLoad(): void {
    if (this.selected) {
      const nestedItemTarget = this.buttonRef;
      if (nestedItemTarget) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (nestedItemTarget as any)[this.activePropName || 'hover'] = true;
      }
    }
    setTimeout(() => {
      this.shouldAnimate = true;
    }, ShortAnimationDuration);
  }

  private handleOpen = () => {
    this.isOpen = true;
  };

  private determineNesting = () => {
    let depth = 0;
    let parent = this.elm.parentElement;
    if (parent === null) {
      return 0;
    }
    while (parent!.tagName.toLowerCase() !== 'br-tree') {
      if (parent!.tagName.toLowerCase() === 'br-tree-item') {
        depth++;
      }
      parent = parent!.parentElement;
    }
    return depth;
  };

  render() {
    const depth = this.determineNesting();
    const hasChildren = this.elm.querySelector(':scope > br-tree-item') !== null;
    return (
      <Host tabindex={-1}>
        <br-button
          class="br-tree-item-button-wrapper"
          ref={(ref) => (this.buttonRef = ref)}
          theme={this.theme}
          width={this.width}
          height={this.height}
          fullWidth={this.fullWidth}
          fullHeight={this.fullHeight}
          ellipsis={true}
          shape={'Rectangular'}
          fillStyle={'Ghost'}
          contentAlignment={'Left'}
          alignContentToMargins={true}
          size={this.size}
          colorType={this.buttonRef && this.buttonRef.active ? 'Primary' : 'Neutral'}
          disabled={this.disabled}
          onClick={this.handleClick}
        >
          <br-button
            slot="left-icon"
            theme={this.theme}
            fillStyle="Ghost"
            colorType={this.buttonRef && this.buttonRef.active ? 'Primary' : 'Neutral'}
            disabled={!hasChildren}
            size="Small"
            style={{
              paddingLeft: `calc(${depth + 0} * var(--tree-item-padding-size))`,
              opacity: hasChildren ? '1' : '0',
              pointerEvents: hasChildren ? 'auto' : 'none',
            }}
            onClick={(e) => {
              e.stopImmediatePropagation();
              e.stopPropagation();
              this.isOpen = !this.isOpen;
            }}
          >
            <br-icon slot="left-icon" iconName={!this.isOpen ? 'ChevronRight' : 'ChevronDown'} />
          </br-button>
          <slot></slot>
          <slot slot="right-icon" name="right"></slot>
        </br-button>
        <br-accordion animated={this.shouldAnimate} isOpen={this.isOpen} onOpen={this.handleOpen}>
          <slot name="children"></slot>
        </br-accordion>
      </Host>
    );
  }
}

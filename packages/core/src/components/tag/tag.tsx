import { h, Component, Host, Prop, Event, EventEmitter } from '@stencil/core';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseColorType } from '../../reserved/editor-types';

// This id increments for all buttons on the page
let tagId = 0;

/**
 * The Tag component is used to display a small amount of information in a compact format.
 * @category Display
 * @slot left-icon - A slot for the left icon.
 * @slot - A slot for the text content.
 * @slot right-icon - A slot for the right icon.
 */
@Component({
  tag: 'br-tag',
  styleUrl: './css/tag.css',
  shadow: true,
})
export class Tag {
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-tag-${tagId++}`;
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
  @Prop({ reflect: true }) shape: Shape = 'Rectangular';
  /**
   * Determines if the component displays an ellipsis when the text does not fit the wrapper.
   * @category Appearance
   */
  @Prop({ reflect: true }) ellipsis?: boolean = true;
  /**
   * Determines if the clear affordance is displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showClearIcon: boolean = false;
  /**
   * Determines whether the component should be focusable.
   * @category Behavior
   */
  @Prop({ reflect: true }) focusable?: boolean;
  /**
   * Emits an event when the clear affordance is clicked.
   */
  @Event() clear!: EventEmitter<void>;
  render() {
    return (
      <Host tabindex={this.focusable === true ? 0 : -1}>
        <slot name="left-icon"></slot>
        <slot></slot>
        <slot name="right-icon"></slot>
        {this.showClearIcon && <br-icon onClick={() => this.clear.emit()} iconName="Cross" />}
      </Host>
    );
  }
}

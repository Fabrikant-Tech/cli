import { Component, h, Prop } from '@stencil/core';

/**
 * The single select value component is a component that displays the selected value of a single select component.
 * @category Inputs & Forms
 * @parent single-select
 * @slot - The default slot where the content is displayed.
 */
@Component({
  tag: 'br-single-select-value',
  styleUrl: './css/single-select-value.css',
  shadow: true,
})
export class SingleSelectValue {
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop({ reflect: true }) value?: string;
  /**
   * Determines the placeholder displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() placeholder?: string;

  render() {
    return (
      <span aria-label={this.value || this.placeholder}>
        <slot>{this.value || this.placeholder}</slot>
      </span>
    );
  }
}

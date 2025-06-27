import { h, Component, Host, Prop } from '@stencil/core';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

/**
 * The Field component is a wrapper for the input component. It can be used to display labels, hints, and/or error messages for the input, depending on the props.
 * @category Inputs & Forms
 * @slot - Passes the input and label to the Field element.
 */
@Component({
  tag: 'br-field',
  styleUrl: './css/field.css',
  shadow: true,
})
export class Field {
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'vertical';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() width?: BaseSize<BaseSizes>;

  render() {
    return (
      <Host
        style={{
          width: this.width,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

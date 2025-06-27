import { Component, ComponentInterface, Host, h } from '@stencil/core';

/**
 * The Form Content component enables the display of fields and form controls.
 * @category Inputs & Forms
 * @parent form
 * @slot - Passes the fields and form controls to the form content.
 */
@Component({
  tag: 'br-form-content',
  styleUrl: 'css/form-content.css',
  shadow: true,
})
export class FormContent implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

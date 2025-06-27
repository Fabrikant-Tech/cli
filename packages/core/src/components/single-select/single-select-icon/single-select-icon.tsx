import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import { deepCloneElement } from '../../animation/utils/utils';
import { isEqual } from 'lodash-es';

/**
 * The single select icon component is a component that displays the selected value icon of a single select component.
 * @category Inputs & Forms
 * @parent single-select
 * @slot - The default slot where the content is displayed.
 */
@Component({
  tag: 'br-single-select-icon',
  styleUrl: './css/single-select-icon.css',
  shadow: true,
})
export class SingleSelectIcon {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSingleSelectIconElement;
  /**
   * Defines the value of the component.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop({ reflect: true }) value?: any;
  @Watch('value')
  async valueChanged() {
    if (!this.elm?.shadowRoot) {
      return;
    }
    this.elm.shadowRoot.innerHTML = '';
    const singleOrComboSelect = this.elm.closest('br-single-select, br-combo-select') as
      | HTMLBrSingleSelectElement
      | HTMLBrComboSelectElement;
    if (singleOrComboSelect) {
      const value = singleOrComboSelect.value ? singleOrComboSelect.value[0] : undefined;
      if (value) {
        const itemsInSelect = await singleOrComboSelect.getItems();
        const item = itemsInSelect.find((item) => isEqual(item.value, value));
        if (item) {
          const iconContent = item.querySelector('*[slot="left-icon"]');
          if (iconContent) {
            const clonedElement = deepCloneElement(iconContent as HTMLElement);
            clonedElement.removeAttribute('slot');
            this.elm.shadowRoot.appendChild(clonedElement);
          } else {
            this.elm.shadowRoot.innerHTML = '';
          }
        }
      } else {
        this.elm.shadowRoot.innerHTML = '';
      }
    }
  }

  render() {
    if (this.value) {
      return <Host style={{ display: this.value ? 'block' : 'none' }}></Host>;
    }
  }
}

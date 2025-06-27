import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';

// This id increments for all tab panels on the page
let tabId = 0;

/**
 * The Tab Panel is the child component of the Tab Content. It contains the content for each Tab Item in the Tab List.
 * @category Navigation
 * @parent tab-content
 * @slot - Passes the content of the Tab Panel.
 */
@Component({
  tag: 'br-tab-panel',
  styleUrl: 'css/tab-panel.css',
  shadow: { delegatesFocus: true },
})
export class TabPanel implements ComponentInterface {
  @Element() elm: HTMLBrTabPanelElement;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-tab-panel-${tabId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value: string | undefined;
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active: boolean = false;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean = true;
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
  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

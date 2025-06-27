import { Component, ComponentInterface, Element, Host, Prop, Watch, h } from '@stencil/core';

/**
 * The Tab Content displays a set of Tab Panel elements.
 * @category Navigation
 * @slot - Passes the Tab Content to the Tab Container.
 */
@Component({
  tag: 'br-tab-content',
  styleUrl: 'css/tab-content.css',
  shadow: { delegatesFocus: true },
})
export class TabContent implements ComponentInterface {
  @Element() elm: HTMLBrTabContentElement;
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value: string | undefined;
  @Watch('value')
  handleValueChanged(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue !== oldValue) {
      this.setValue(newValue);
    }
  }

  private internalGetBoundingClientRect() {
    const panels = this.elm.querySelectorAll('br-tab-panel');
    if (panels.length === 0) {
      return;
    }
    const activeTabPanel = Array.from(panels).find((tab) => tab.active);
    return (activeTabPanel || Array.from(panels)[0])?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    if (this.value) {
      this.setValue(this.value);
    }
  }

  private setValue = (value: string | undefined) => {
    const valueToSet = value || this.value;
    const tabs = this.elm.querySelectorAll('br-tab-panel');
    tabs.forEach((t) => (t.active = false));
    const tabValue = Array.from(tabs).find((tab) => tab.value === valueToSet);
    if (tabValue) {
      tabValue.active = true;
    }
  };

  render() {
    return (
      <Host role="tabpanel">
        <slot></slot>
      </Host>
    );
  }
}

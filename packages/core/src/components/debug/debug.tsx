import { Component, ComponentInterface, Host, Prop, Watch, h } from '@stencil/core';
import { DebugMode } from './types/utils';

/**
 * The debug wrapper component is a wrapper that can be used to show debug information in the browser.
 * @category Internal
 * @visibility hidden
 */
@Component({
  tag: 'br-debug-wrapper',
  styleUrl: 'css/debug-wrapper.css',
})
export class DebugWrapper implements ComponentInterface {
  /**
   * If true, the debug wrapper will be shown.
   */
  @Prop() debug: boolean = false;
  @Watch('debug')
  debugChanged(newValue: boolean) {
    DebugMode.setCurrentDebug(newValue);
  }
  connectedCallback(): void {
    DebugMode.setCurrentDebug(this.debug);
  }
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'demo-br-button',
})
export class DemoButton {
  render() {
    return (
      <Host>
        <br-button>Test</br-button>
      </Host>
    );
  }
}

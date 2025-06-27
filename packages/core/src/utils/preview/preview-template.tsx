/* eslint-disable @stencil-community/required-prefix */
import { Element, EventEmitter, Host, Prop, VNode, h } from '@stencil/core';
import { Component, Event, Method } from '@stencil/core';
import { DesignbaseComponentExample } from './preview-types';

/**
 * @internal
 */
@Component({
  tag: 'designbase-preview',
})
export class DesignbasePreview {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLDesignbasePreviewElement;
  /**
   * The preview to show
   */

  @Prop() example!: DesignbaseComponentExample;
  /**
   * Whether the example should be displayed.
   */
  @Prop() showExample: boolean = false;
  /**
   * Return the html string
   */
  @Method()
  async getAsHTML(): Promise<string | null> {
    return this.elm.innerHTML;
  }
  /**
   * Return the element
   */
  @Method()
  async getAsChild(): Promise<Element | null> {
    return this.elm.firstElementChild;
  }
  /**
   * Return the vNode
   */
  @Method()
  async getAsVNode(): Promise<VNode | null> {
    return this.example.render();
  }
  /**
   * Loaded
   */
  @Event() loaded: EventEmitter<void>;

  componentDidLoad() {
    this.loaded.emit();
  }

  render() {
    return (
      <Host
        style={{
          display: 'contents',
        }}
      >
        {this.example.render(this.example.params)}
      </Host>
    );
  }
}

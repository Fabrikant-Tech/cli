import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../../reserved/editor-types';

/**
 * The Sidebar Content component enables the display of a sidebar and content element.
 * @category Layout
 * @slot sidebar - Passes the sidebar content.
 * @slot content - Passes the content.
 */
@Component({
  tag: 'br-layout-sidebar-content',
  styleUrl: '../css/layout.css',
  shadow: true,
})
export class LayoutSidebarContent implements ComponentInterface {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() theme: Theme = ThemeDefault;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes> = '100%';
  /**
   * Determines what type of scrolling is allowed in the sidebar part of the component.
   * @category Appearance
   */
  @Prop() sidebarAllowedScroll: 'horizontal' | 'vertical' | 'any' | false = false;
  /**
   * Determines what type of scrolling is allowed in the content part of the component.
   * @category Appearance
   */
  @Prop() contentAllowedScroll: 'horizontal' | 'vertical' | 'any' | false = 'vertical';
  /**
   * Determines the direction of the sidebar.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() direction: 'left' | 'right' = 'left';
  /**
   * Event that triggers when scroll happens.
   */
  @Event() scroll: EventEmitter<{ left: number; top: number }>;
  /**
   * Event that triggers when scroll starts.
   */
  @Event() scrollStart: EventEmitter<{ left: number; top: number }>;
  /**
   * Event that triggers when scroll stops.
   */
  @Event() scrollStop: EventEmitter<{ left: number; top: number }>;

  private handleScroll = (e: CustomEvent<{ left: number; top: number }> | Event) => {
    const isCustomEvent = e instanceof CustomEvent;
    if (!isCustomEvent) {
      return;
    }
    this.scroll.emit(e.detail);
  };

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <br-container
          fullWidth={true}
          fullHeight={true}
          theme={this.theme}
          direction={this.direction === 'left' ? 'row' : 'row-reverse'}
        >
          <br-container
            direction="row"
            height="100%"
            shrink={false}
            theme={this.theme}
            allowedScroll={this.sidebarAllowedScroll}
            zIndex={2}
            onScroll={this.handleScroll}
            onScrollStart={(e) => this.scrollStart.emit(e.detail)}
            onScrollStop={(e) => this.scrollStop.emit(e.detail)}
          >
            <slot name="sidebar"></slot>
          </br-container>
          <br-container
            width="100%"
            direction="column"
            height="100%"
            shrink={true}
            theme={this.theme}
            allowedScroll={this.contentAllowedScroll}
            zIndex={1}
            onScroll={this.handleScroll}
            onScrollStart={(e) => this.scrollStart.emit(e.detail)}
            onScrollStop={(e) => this.scrollStop.emit(e.detail)}
          >
            <slot name="content"></slot>
          </br-container>
        </br-container>
      </Host>
    );
  }
}

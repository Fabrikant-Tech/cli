import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { BaseColorType } from '../../../reserved/editor-types';
import { ColorType, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';

/**
 * The Sidebar item component displays a single item in the sidebar.
 * @category Display
 * @parent sidebar
 * @slot - Passes the sidebar item label.
 * @slot left-icon - Passes the left icon.
 * @slot right-icon - Passes the right icon.
 */
@Component({
  tag: 'br-sidebar-item',
  styleUrl: 'css/sidebar-item.css',
  shadow: true,
})
export class SidebarItem {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSidebarItemElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines whether the sidebar item is minimized or not
   */
  @Prop({ reflect: true }) minimized: boolean = false;
  /**
   * Defines whether the sidebar item is active or not
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) active: boolean = false;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Primary';
  /**
   * Whether a tooltip will be shown in its closed state.
   * @category Behavior
   */
  @Prop() showTooltip?: boolean;
  /**
   * What tooltip label to display.
   */
  @Prop() tooltipLabel?: string;
  /**
   * Event emitted when the sidebar item is hovered or hover is disabled.
   */
  @Event() hover: EventEmitter<HTMLBrSidebarItemElement | undefined>;

  private internalGetBoundingClientRect() {
    return this.elm?.shadowRoot?.firstElementChild?.getBoundingClientRect();
  }

  componentWillLoad(): void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    return (
      <Host>
        <br-button
          active={this.active}
          theme={this.theme}
          fullWidth={true}
          colorType={this.colorType || 'Neutral'}
          fillStyle="Ghost"
          alignContentToMargins={!this.minimized}
          ellipsis={true}
          onMouseOver={() => {
            if (!this.showTooltip) {
              return;
            }
            this.hover.emit(this.elm);
          }}
          onMouseLeave={() => {
            if (!this.showTooltip) {
              return;
            }
            this.hover.emit(undefined);
          }}
        >
          <slot name="left-icon" slot="left-icon"></slot>
          {!this.minimized && <slot></slot>}
          {!this.minimized && <slot name="right-icon" slot="right-icon"></slot>}
        </br-button>
      </Host>
    );
  }
}

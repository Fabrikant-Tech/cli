import { Component, ComponentInterface, Element, Host, Prop, State, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseSize, BaseSizes, BaseTextAlignment } from '../../../reserved/editor-types';

/**
 * The table header component is a child of the table row component and is used to define the cells within the header.
 * @category Display
 * @parent table-row
 * @slot - Passes the content to the cell.
 */
@Component({
  tag: 'br-table-header',
  styleUrl: 'css/table-header.css',
  shadow: true,
})
export class TableHeader implements ComponentInterface {
  /**
   * Whether the header cell is hovered.
   */
  @State() isHovered: boolean = false;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTableHeaderElement;
  /**
   * Defines the data id / the column this is associated with.
   * @category Data
   * @visibility persistent
   */
  @Prop({ reflect: true }) columnId: string;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * Determines if the component displays an ellipsis when the text does not fit the wrapper.
   * @category Appearance
   */
  @Prop({ reflect: true }) ellipsis: boolean = false;
  /**
   * Defines the sort direction displayed in the column.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() sortDirection: 'asc' | 'desc' | undefined;
  /**
   * Determines if a sorting affordance is displayed.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() sortable: boolean = true;
  /**
   * Determines if the column is visible.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() visible?: boolean;
  /**
   * Defines the how many columns the component spans.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) colSpan: number;
  /**
   * Defines the how many rows the component spans.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) rowSpan: number;
  /**
   * Defines how the text is aligned within the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) textAlign: BaseTextAlignment = 'left';
  /**
   * Defines whether the cell has any padding.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) noPadding: boolean = false;

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('th')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    return (
      <Host
        class={{
          'br-table-cell-sticky-right':
            this.columnId === 'Actions' || this.columnId === 'ActionsButton',
        }}
      >
        <th
          hidden={!this.visible}
          colSpan={this.colSpan}
          rowSpan={this.rowSpan}
          onMouseOver={() => {
            this.isHovered = true;
          }}
          onMouseLeave={() => {
            this.isHovered = false;
          }}
          style={{
            display:
              this.visible === undefined || this.visible === true
                ? `var(--table-hidden-cell-${this.columnId}, table-cell)`
                : 'none',
            left: `var(--table-${this.columnId}-column-left)`,
            right: `var(--table-${this.columnId}-column-right)`,
            position: `var(--table-${this.columnId}-column-position, relative)`,
            zIndex: `var(--table-${this.columnId}-z-index)`,
            width: this.width,
            minWidth: !this.ellipsis ? this.width : `var(--table-${this.columnId}-column-width)`,
            maxWidth: this.ellipsis ? `var(--table-${this.columnId}-column-width)` : 'none',
            willChange: 'left, width, max-width, min-width, right, position, display, z-index',
          }}
        >
          <div
            class="br-table-cell-shadow-container br-table-cell-shadow-container-right"
            style={{
              display: `var(--table-${this.columnId}-sticky-shadow-display-right, none)`,
              willChange: 'display',
            }}
          >
            <div class="br-table-cell-shadow-inner-container br-table-cell-shadow-inner-container-right" />
          </div>
          <div
            class="br-table-cell-shadow-container"
            style={{
              display: `var(--table-${this.columnId}-sticky-shadow-display, none)`,
              willChange: 'display',
            }}
          >
            <div class="br-table-cell-shadow-inner-container" />
          </div>
          <div
            class="br-table-cell-hover-container"
            style={{
              display: `var(--table-hover-display, var(--table-row-cell-display, var(--table-${this.columnId}-cell-hover-display, none)))`,
              willChange: 'display',
            }}
          />
          <div class="br-table-header-cell-wrapper">
            <div
              class="br-table-header-cell-content"
              style={{
                whiteSpace: this.ellipsis ? 'nowrap' : 'normal',
                overflow: this.ellipsis ? 'hidden' : 'visible',
                textOverflow: this.ellipsis ? 'ellipsis' : 'clip',
              }}
              onClick={() => {
                if (!this.sortable) return;
                this.elm.closest('br-table')?.sortTable(this.columnId);
              }}
            >
              <slot></slot>
            </div>
            <br-button
              disabled={!(this.sortable && (this.isHovered || this.sortDirection))}
              style={{
                display: !this.sortable ? 'none' : undefined,
                opacity: this.sortable && !(this.isHovered || this.sortDirection) ? '0' : undefined,
              }}
              theme={this.theme}
              size={this.elm.closest('br-table')?.size === 'Large' ? 'Normal' : 'Small'}
              fillStyle="Ghost"
              colorType={this.sortDirection !== undefined ? 'Primary' : 'Neutral'}
              onClick={() => {
                this.elm.closest('br-table')?.sortTable(this.columnId);
              }}
            >
              <br-icon
                iconName={
                  this.sortDirection !== 'desc' ? 'LineSortAscending' : 'LineSortDescending'
                }
                slot="left-icon"
              />
            </br-button>
          </div>
        </th>
      </Host>
    );
  }
}

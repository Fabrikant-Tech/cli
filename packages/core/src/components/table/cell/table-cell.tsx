import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseTextAlignment } from '../../../reserved/editor-types';

/**
 * The table cell component is a child of the table row component and is used to define the cells within the table.
 * @category Display
 * @parent table-row
 * @slot - Passes the content to the cell.
 */
@Component({
  tag: 'br-table-cell',
  styleUrl: 'css/table-cell.css',
  shadow: true,
})
export class TableCell implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTableCellElement;
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
   * Defines the value of the cell to use for sorting.
   */
  @Prop() sortValue?: string | number;
  /**
   * Defines how the text is aligned within the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) textAlign: BaseTextAlignment = 'left';
  /**
   * Defines how the text is aligned within the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) verticalAlign: 'top' | 'middle' | 'bottom' = 'middle';
  /**
   * Defines whether the cell has any padding.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) noPadding: boolean = false;
  /**
   * Whether the cell is interactive or not.
   * @category Behavior
   * @visibility persistent
   */
  @Prop({ reflect: true }) selectionInteractive: boolean = true;

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('td')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    const verticalAlign =
      (this.verticalAlign === 'top' && 'flex-start') ||
      (this.verticalAlign === 'bottom' && 'flex-end') ||
      'center';
    return (
      <Host>
        <td
          colSpan={this.colSpan}
          rowSpan={this.rowSpan}
          style={{
            display: `var(--table-hidden-cell-${this.columnId}, table-cell)`,
            left: `var(--table-${this.columnId}-column-left, unset)`,
            right: `var(--table-${this.columnId}-column-right, unset)`,
            position: `var(--table-${this.columnId}-column-position, relative)`,
            zIndex: `var(--table-${this.columnId}-z-index)`,
            width: `var(--table-${this.columnId}-column-width)`,
            maxWidth: `var(--table-${this.columnId}-column-width)`,
            willChange: 'left, width, max-width, right, position, display, z-index',
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
          <div
            class="br-table-cell-wrapper"
            style={{
              alignItems: verticalAlign,
            }}
          >
            <div
              class="br-table-cell-content"
              style={{
                whiteSpace: `var(--table-${this.columnId}-white-space)`,
                overflow: `var(--table-${this.columnId}-overflow)`,
                textOverflow: `var(--table-${this.columnId}-text-overflow)`,
              }}
            >
              <slot></slot>
            </div>
          </div>
        </td>
      </Host>
    );
  }
}

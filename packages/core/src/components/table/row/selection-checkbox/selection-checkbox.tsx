import { Component, ComponentInterface, Element, Prop, State, Watch, h } from '@stencil/core';
import { Theme, Size } from '../../../../generated/types/types';
import { ThemeDefault } from '../../../../generated/types/variables';

/**
 * The table row selection affordance shows if a row is selected by displaying a checkbox.
 * @category Display
 * @parent table-row
 */
@Component({
  tag: 'br-table-row-selection-checkbox',
  styleUrl: 'css/table-row-selection-checkbox.css',
  shadow: true,
})
export class TableRowSelectionCheckbox implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTableRowSelectionCheckboxElement;
  /**
   * Whether the checkbox is in the header.
   */
  @State() isHeader: boolean = false;
  /**
   * Whether the checkbox is indeterminate.
   */
  @State() indeterminate: boolean = false;
  /**
   * Determines if the component is selected.
   * @category State
   * @visibility persistent
   */
  @Prop({ reflect: true }) selected?: boolean = false;
  /**
   * The selection in the table.
   */
  @Prop() selection: HTMLBrTableRowElement[] = [];
  @Watch('selection')
  selectionChanged() {
    if (!this.isHeader) {
      return;
    }
    const parentTable = this.elm.closest('br-table');
    const rows = parentTable?.querySelectorAll(
      'br-table-row:not([slot="header"])',
    ) as NodeListOf<HTMLBrTableRowElement>;
    if (rows) {
      const allRows = rows.length;
      const selectedRows = Array.from(rows).filter((row) => row.selected).length;
      this.indeterminate = selectedRows > 0 && selectedRows < allRows;
      this.selected = selectedRows === allRows;
    }
  }
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean = false;

  componentWillLoad(): Promise<void> | void {
    this.isHeader = this.elm.closest('br-table-header') !== null;
  }

  private handleClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if (this.isHeader) {
      const parentTable = this.elm.closest('br-table') as HTMLBrTableElement;
      if ((this.indeterminate && this.selected) || !this.selected) {
        this.selected = true;
      }
      parentTable?.toggleSelection();
    } else {
      const parentRow = this.elm.closest('br-table-row');
      if (parentRow && parentRow.selectable) {
        parentRow.shadowRoot?.querySelector('tr')?.click();
      }
    }
  };

  render() {
    return (
      <br-checkbox
        size={this.size}
        theme={this.theme}
        indeterminate={this.indeterminate}
        checked={(this.indeterminate && !this.selected) || this.selected || false}
        disabled={this.disabled}
        onClickCapture={this.handleClick}
      />
    );
  }
}

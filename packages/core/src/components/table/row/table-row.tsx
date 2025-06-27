import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';

/**
 * The table row component is a wrapper for table rows.
 * @category Display
 * @parent table
 * @slot - Passes the cells to the rows.
 */
@Component({
  tag: 'br-table-row',
  styleUrl: 'css/table-row.css',
  shadow: true,
})
export class TableRow implements ComponentInterface {
  @State() isHovered: boolean = false;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTableRowElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component is selected.
   * @category State
   * @visibility persistent
   */
  @Prop({ reflect: true }) selected?: boolean = false;
  /**
   * Determines if the component is selectable.
   */
  @Prop({ reflect: true }) selectable?: boolean = true;
  /**
   * Event that is triggered when the row is clicked.
   */
  @Event({ cancelable: true }) selectRow: EventEmitter<void>;

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('tr')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    const hasSelectionAffordance = this.elm.querySelector(
      'br-table-row-selection-checkbox',
    ) as HTMLBrTableRowSelectionCheckboxElement;
    if (hasSelectionAffordance && !hasSelectionAffordance.size) {
      const tableParent = this.elm.closest('br-table');
      if (tableParent) {
        const tableParentSize = tableParent.size;
        const checkboxSize =
          (tableParentSize === 'Normal' && 'Small') ||
          (tableParentSize === 'Small' && 'Xsmall') ||
          'Normal';
        hasSelectionAffordance.size = checkboxSize;
      }
    }
  }

  private handleMouseOver = () => {
    this.isHovered = true;
  };

  private handleMouseLeave = () => {
    this.isHovered = false;
  };

  private handleRowClick = (e: MouseEvent) => {
    const path = e.composedPath();
    const cell = path.find(
      (t) => t instanceof HTMLElement && t.tagName.toLowerCase() === 'br-table-cell',
    );

    if (cell && (cell as HTMLBrTableCellElement).selectionInteractive === false) {
      return;
    }

    if (this.elm.slot === 'header') {
      return;
    }
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectRow.emit();
    }
    const hasSelectionAffordance = this.elm.querySelector(
      'br-table-row-selection-checkbox',
    ) as HTMLBrTableRowSelectionCheckboxElement;
    if (hasSelectionAffordance) {
      hasSelectionAffordance.selected = this.selected;
    }
  };

  render() {
    return (
      <Host>
        <tr
          onClick={this.handleRowClick}
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
        >
          <slot></slot>
        </tr>
      </Host>
    );
  }
}

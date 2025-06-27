import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { isEqual } from 'lodash-es';

/**
 * The table displays simple data compositionally.
 * @category Display
 * @slot header - Passes the rows to the table header.
 * @slot - Passes the rows to the table.
 * @slot footer - Passes the footer content to the table.
 */
@Component({
  tag: 'br-table',
  styleUrl: 'css/table.css',
  shadow: true,
})
export class Table implements ComponentInterface {
  /**
   * A resize observer to monitor the changes in content.
   */
  private resizeObserver: ResizeObserver;
  /**
   * Whether the Table has a nested footer.
   */
  @State() hasFooter: boolean;
  /**
   * Stores the original order of the rows.
   */
  @State() originalRows: HTMLBrTableRowElement[] = [];
  /**
   * Stores the sorting direction.
   */
  @State() sortingDirection: 'asc' | 'desc' | undefined;
  @Watch('sortingDirection')
  handleSortingDirectionChange(newValue: 'asc' | 'desc' | undefined) {
    this.sort.emit({ columnId: this.sortingColumn, direction: newValue });
  }
  /**
   * Stores whether the table is scrolled vertically.
   */
  @State() verticalScroll: number = 0;
  /**
   * Stores whether the table is scrolled vertically.
   */
  @State() horizontalScroll: number = 0;
  /**
   * Stores the sorting column.
   */
  @State() sortingColumn: string | undefined;
  /**
   * Stores the hovered cell.
   */
  @State() hoveredCell: HTMLBrTableCellElement | HTMLBrTableHeaderElement | undefined;
  /**
   * Stores the hovered row.
   */
  @State() hoveredRow: HTMLBrTableRowElement | undefined;
  /**
   * Stores the hovered column id.
   */
  @State() hoveredColumnId: string[] | undefined;
  /**
   * Stores the max scroll.
   */
  @State() maxScroll: number | undefined = -2;
  /**
   * Stores the style that controls the widths of the columns.
   */
  @State() widthStyle: string;
  /**
   * Stores the style.
   */
  @State() leftPositionStyle: string;
  /**
   * Stores the style.
   */
  @State() rightPositionStyle: string;
  /**
   * Stores the hidden columns style.
   */
  @State() hiddenColumnStyles: string;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTableElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'> = 'Normal';
  /**
   * Determines the last columnId that is pinned on each header row on the left of the table.
   * @category Appearance
   */
  @Prop() leftPinnedColumnIds?: string[];
  @Watch('leftPinnedColumnIds')
  handleLeftPinnedColumnIdsChange(newValue: string[], oldValue: string[]) {
    if (!isEqual(newValue, oldValue)) {
      this.generateTableColumnHiddenStyles();
      this.generateTableColumnWidths();
      this.generateLeftTableColumnPositions();
    }
  }
  /**
   * Determines the last columnId that is pinned on each header row on the right of the table.
   * @category Appearance
   */
  @Prop() rightPinnedColumnIds?: string[];
  @Watch('rightPinnedColumnIds')
  handleRightPinnedColumnIdsChange(newValue: string[], oldValue: string[]) {
    if (!isEqual(newValue, oldValue)) {
      this.generateTableColumnHiddenStyles();
      this.generateTableColumnWidths();
      this.generateRightTableColumnPositions();
    }
  }
  /**
   * Determines which borders are displayed in the component.
   * @category Appearance
   */
  @Prop({ reflect: true }) border:
    | 'all'
    | 'all-no-edge'
    | 'none'
    | 'horizontal'
    | 'vertical'
    | 'edge' = 'all';
  /**
   * Determines whether the rows are checkered.
   * @category Appearance
   */
  @Prop({ reflect: true }) checkered?: boolean = true;
  /**
   * Determines if the component is displayed with rounded corners.
   * @category Appearance
   */
  @Prop({ reflect: true }) roundedCorners?: boolean = true;
  /**
   * Determines which elements are highlighted when hovering over the table.
   * @category Appearance
   */
  @Prop({ reflect: true }) hoverDisplay?: 'all' | 'row' | 'cell' | 'column' | 'none' = 'row';
  /**
   * Determines the sorting mode.
   * @category Behavior
   */
  @Prop() sortMode: 'front-end' | 'back-end' = 'front-end';
  /**
   * Passes a custom sort function.
   * @category Data
   */
  @Prop() sortFunction?: (
    a: string | number,
    b: string | number,
    sortingDirection: 'asc' | 'desc' | undefined,
  ) => number;
  /**
   * Determines what happens when the horizontal boundary of the scroll area is reached when scrolling.
   * @category Behavior
   */
  @Prop({ reflect: true }) overscrollX: 'auto' | 'contain' | 'none' = 'contain';
  /**
   * Determines what happens when the vertical boundary of the scroll area is reached when scrolling.
   * @category Behavior
   */
  @Prop({ reflect: true }) overscrollY: 'auto' | 'contain' | 'none' = 'contain';
  /**
   * Determines the hidden columns.
   * @category Data
   * @visibility persistent
   */
  @Prop() hiddenColumnIds?: string[];
  @Watch('hiddenColumnIds')
  handleHiddenColumnIdsChange(newValue: string[], oldValue: string[]) {
    if (!isEqual(newValue, oldValue)) {
      this.generateTableColumnHiddenStyles();
      this.generateTableColumnWidths();
      this.generateLeftTableColumnPositions();
      this.generateRightTableColumnPositions();
    }
  }
  /**
   * Highlighted column.
   */
  @Prop() highlightedColumnId?: string[];
  @Watch('highlightedColumnId')
  handleHighlightedColumnIdChange(newValue: string[], oldValue: string[]) {
    if (newValue !== oldValue) {
      this.hoveredColumnId = newValue;
    }
  }
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
  /**
   * Event that emits when a table row is selected.
   */
  @Event() selectRow: EventEmitter<{ selection: HTMLBrTableRowElement[] }>;
  /**
   * Event that emits when the sorting changes.
   */
  @Event() sort!: EventEmitter<{
    columnId: string | undefined;
    direction: 'asc' | 'desc' | undefined;
  }>;
  /**
   * A method to sort the table given a column id.
   */
  @Method()
  async sortTable(columnId: string, sortingDirection?: 'asc' | 'desc') {
    if (this.sortingColumn !== columnId) {
      const currentSortedColumn = this.elm?.querySelector(
        `br-table-header[column-id="${this.sortingColumn}"]`,
      ) as HTMLBrTableHeaderElement;
      if (currentSortedColumn) {
        currentSortedColumn.sortDirection = undefined;
      }
      this.sortingColumn = columnId;
      this.sortingDirection = sortingDirection || undefined;
    }
    const columnExists = this.elm?.querySelector(`br-table-header[column-id="${columnId}"]`);
    if (!columnExists) {
      return;
    }
    const rows = Array.from(this.elm.querySelectorAll('br-table-row'))
      .filter((c) => c.closest('br-table') === this.elm)
      .filter((r) => !r.querySelector('br-table-header'));
    this.sortingDirection =
      sortingDirection ||
      (!this.sortingDirection && 'asc') ||
      (this.sortingDirection === 'asc' && 'desc') ||
      undefined;
    const newSortedColumn = this.elm?.querySelector(
      `br-table-header[column-id="${columnId}"]`,
    ) as HTMLBrTableHeaderElement;
    if (newSortedColumn) {
      newSortedColumn.sortDirection = this.sortingDirection;
    }
    if (this.sortMode === 'back-end') {
      return;
    }
    const sortedRows = (this.sortingDirection ? rows : this.originalRows).sort((a, b) => {
      const aCell = a.querySelector(`br-table-cell[column-id="${columnId}"]`);
      const bCell = b.querySelector(`br-table-cell[column-id="${columnId}"]`);
      if (!aCell || !bCell) {
        return 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aText: string = (aCell as any).sortValue || (aCell as any).innerText;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bText: string = (bCell as any).sortValue || (bCell as any).innerText;

      if (this.sortFunction) {
        return this.sortFunction(aText, bText, this.sortingDirection);
      }

      const aValue = (!isNaN(Number(aText)) && Number(aText)) || aText;
      const bValue = (!isNaN(Number(bText)) && Number(bText)) || bText;
      if (this.sortingDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      if (this.sortingDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return 0;
    });
    const moveRowsBasedOnSorting = () => {
      sortedRows.forEach((r) => {
        this.elm.appendChild(r);
      });
    };
    moveRowsBasedOnSorting();
  }
  /**
   * A method to toggle the selection of all rows.
   */
  @Method()
  async toggleSelection() {
    const allRows = Array.from(this.elm.querySelectorAll('br-table-row')).filter(
      (c) => c.closest('br-table') === this.elm,
    ) as HTMLBrTableRowElement[];
    const relevantRows = Array.from(
      this.elm.querySelectorAll('br-table-row:not([slot="header"])'),
    ).filter((c) => c.closest('br-table') === this.elm) as HTMLBrTableRowElement[];
    const selectionLength = relevantRows.filter((r) => r.selected).length;
    const noSelection = selectionLength === 0;
    const shouldSet = selectionLength < relevantRows.length;
    relevantRows.forEach((r) => {
      r.selected = noSelection || shouldSet;
      const selectionBox = r.querySelector(
        'br-table-row-selection-checkbox',
      ) as HTMLBrTableRowSelectionCheckboxElement;
      if (selectionBox) {
        selectionBox.selected = noSelection || shouldSet;
      }
    });

    const selection = Array.from(this.elm.querySelectorAll('br-table-row[selected]')).filter(
      (c) => c.closest('br-table') === this.elm,
    ) as HTMLBrTableRowElement[];

    allRows.forEach((r) => {
      const selectionBox = r.querySelector(
        'br-table-row-selection-checkbox',
      ) as HTMLBrTableRowSelectionCheckboxElement;
      if (selectionBox) {
        selectionBox.selection = selection;
      }
    });

    this.selectRow.emit({
      selection: relevantRows.filter((r) => r.selected),
    });
  }
  /**
   * A method to clear the selection of all rows.
   */
  @Method()
  async clearSelection() {
    const allRows = Array.from(this.elm.querySelectorAll('br-table-row')).filter(
      (c) => c.closest('br-table') === this.elm,
    ) as HTMLBrTableRowElement[];
    const relevantRows = Array.from(
      this.elm.querySelectorAll('br-table-row:not([slot="header"])'),
    ).filter((c) => c.closest('br-table') === this.elm) as HTMLBrTableRowElement[];
    relevantRows.forEach((r) => {
      r.selected = false;
      const selectionBox = r.querySelector(
        'br-table-row-selection-checkbox',
      ) as HTMLBrTableRowSelectionCheckboxElement;
      if (selectionBox) {
        selectionBox.selected = false;
      }
    });

    const selection = Array.from(this.elm.querySelectorAll('br-table-row[selected]')).filter(
      (c) => c.closest('br-table') === this.elm,
    ) as HTMLBrTableRowElement[];

    allRows.forEach((r) => {
      const selectionBox = r.querySelector(
        'br-table-row-selection-checkbox',
      ) as HTMLBrTableRowSelectionCheckboxElement;
      if (selectionBox) {
        selectionBox.selection = selection;
      }
    });

    this.selectRow.emit({
      selection: relevantRows.filter((r) => r.selected),
    });
  }

  private generateTableColumnHiddenStyles() {
    if (!this.hiddenColumnIds) {
      return;
    }

    let style: string = ':host {';
    this.hiddenColumnIds.forEach((c) => {
      style = style + `--table-hidden-cell-${c}: none;`;
    });
    style = style + '}';
    this.hiddenColumnStyles = style;
  }

  private generateLeftTableColumnPositions() {
    if (!this.leftPinnedColumnIds) {
      return;
    }

    const rowsInHeader = this.elm?.querySelectorAll('br-table-row[slot="header"]');

    if (!rowsInHeader) {
      return;
    }

    const relevantRows = Array.from(rowsInHeader).filter((c) => c.closest('br-table') === this.elm);
    if (relevantRows.length === 0) {
      return;
    }

    let style: string = ':host {';
    relevantRows
      .filter((c) => c.closest('br-table') === this.elm)
      .forEach((r) => {
        const columns = r.querySelectorAll('br-table-header');
        const columnArray = Array.from(columns);
        const lastColumnIndex = columnArray.findIndex((c) =>
          this.leftPinnedColumnIds?.includes(c.columnId),
        );
        const leftColumns = columnArray.slice(0, lastColumnIndex + 1);

        let currentWidth = '0px';
        leftColumns.forEach((lc, i) => {
          const boxWidth = `${lc.getBoundingClientRect().width}px`;
          style =
            style +
            `--table-${lc.columnId}-column-left: ${currentWidth}; --table-${lc.columnId}-column-position: sticky; --table-${lc.columnId}-z-index: ${i + 1};`;
          if (this.leftPinnedColumnIds?.includes(lc.columnId) && this.horizontalScroll > 0) {
            style = style + `--table-${lc.columnId}-sticky-shadow-display: block;`;
          }
          currentWidth = `calc(${currentWidth} + ${boxWidth || 0})`;
        });
      });

    style = style + '}';
    this.leftPositionStyle = style;
  }

  private generateRightTableColumnPositions() {
    if (!this.rightPinnedColumnIds) {
      return;
    }

    const rowsInHeader = this.elm?.querySelectorAll('br-table-row[slot="header"]');

    if (!rowsInHeader) {
      return;
    }

    const relevantRows = Array.from(rowsInHeader).filter((c) => c.closest('br-table') === this.elm);
    if (relevantRows.length === 0) {
      return;
    }

    let style: string = ':host {';
    relevantRows
      .filter((c) => c.closest('br-table') === this.elm)
      .forEach((r) => {
        const columns = r.querySelectorAll('br-table-header');
        const columnArray = Array.from(columns).reverse();
        const lastColumnIndex = columnArray.findIndex((c) =>
          this.rightPinnedColumnIds?.includes(c.columnId),
        );
        const leftColumns = columnArray.slice(0, lastColumnIndex + 1);

        let currentWidth = '0px';
        leftColumns.forEach((lc) => {
          const indexInColumns = Array.from(columns).findIndex((c) => c.columnId === lc.columnId);
          const boxWidth = `${lc.getBoundingClientRect().width}px`;
          style =
            style +
            `--table-${lc.columnId}-column-right: ${currentWidth}; --table-${lc.columnId}-column-position: sticky; --table-${lc.columnId}-z-index: ${indexInColumns + 1};`;

          const doesNotHaveStickyRightShadow =
            this.maxScroll === -2 || (this.maxScroll && this.horizontalScroll >= this.maxScroll);
          if (this.rightPinnedColumnIds?.includes(lc.columnId) && !doesNotHaveStickyRightShadow) {
            style = style + `--table-${lc.columnId}-sticky-shadow-display-right: block;`;
          }
          currentWidth = `calc(${currentWidth} + ${boxWidth || 0})`;
        });
      });

    style = style + '}';
    this.rightPositionStyle = style;
  }

  private generateTableColumnWidths() {
    const columns = this.elm?.querySelectorAll('br-table-header');
    const columnArray = Array.from(columns).filter((c) => c.closest('br-table') === this.elm);

    let style: string = ':host {';
    columnArray.forEach((lc) => {
      if (this.hiddenColumnIds?.includes(lc.columnId)) {
        return;
      }
      const isEllipsis = lc.ellipsis;
      const lcWidth = lc.width;
      style = style + `--table-${lc.columnId}-column-width: ${lcWidth};`;
      if (isEllipsis) {
        style =
          style +
          `--table-${lc.columnId}-white-space: nowrap;--table-${lc.columnId}-overflow: hidden;--table-${lc.columnId}-text-overflow: ellipsis;`;
      }
    });

    style = style + '}';
    this.widthStyle = style;
  }

  private handleFooterDetection = () => {
    this.hasFooter =
      (this.elm.querySelector('br-table-footer') || this.elm.querySelector('*[slot="footer"]')) !==
      null;
  };

  @Listen('selectRow')
  handleSelectRow(e: CustomEvent<{ selection: HTMLBrTableRowElement[] }>) {
    if (e.target === this.elm) {
      return;
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
    const allRows = Array.from(this.elm.querySelectorAll('br-table-row')).filter(
      (c) => c.closest('br-table') === this.elm,
    ) as HTMLBrTableRowElement[];
    const relevantRows = Array.from(
      this.elm.querySelectorAll('br-table-row:not([slot="header"])'),
    ).filter((c) => c.closest('br-table') === this.elm) as HTMLBrTableRowElement[];
    const selectedRows = relevantRows.filter((r) => r.selected);
    this.selectRow.emit({ selection: selectedRows });
    allRows.forEach((r) => {
      const selectionBox = r.querySelector(
        'br-table-row-selection-checkbox',
      ) as HTMLBrTableRowSelectionCheckboxElement;
      if (selectionBox) {
        selectionBox.selection = selectedRows;
      }
    });
  }

  @Listen('mouseover')
  handleMouseEnter(e: MouseEvent) {
    if (!this.elm.contains(e.target as Node)) {
      this.hoveredCell = undefined;
      this.hoveredRow = undefined;
      this.hoveredColumnId = this.highlightedColumnId || undefined;
      return;
    }
    const target = e.target as HTMLBrTableCellElement | HTMLBrTableHeaderElement;
    this.hoveredCell = target;
    this.hoveredRow = target.closest('br-table-row') as HTMLBrTableRowElement;
    this.hoveredColumnId = this.highlightedColumnId
      ? [...this.highlightedColumnId, target.columnId]
      : [target.columnId];
  }

  componentWillLoad(): void {
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.handleFooterDetection();
    this.originalRows = Array.from(
      this.elm.querySelectorAll('br-table-row') as NodeListOf<HTMLBrTableRowElement>,
    ).filter((c) => c.closest('br-table') === this.elm);
    this.generateTableColumnHiddenStyles();
    this.generateTableColumnWidths();
    this.generateLeftTableColumnPositions();
    this.generateRightTableColumnPositions();
    if (this.highlightedColumnId) {
      this.hoveredColumnId = this.highlightedColumnId;
    }
  }

  async componentDidLoad(): Promise<void> {
    this.generateTableColumnHiddenStyles();
    this.generateTableColumnWidths();
    await this.getMaxHorizontalScroll();
    this.generateLeftTableColumnPositions();
    this.generateRightTableColumnPositions();
    this.resizeObserver.observe(this.elm);
  }

  private handleResize = async () => {
    await this.getMaxHorizontalScroll();
    this.generateLeftTableColumnPositions();
    this.generateRightTableColumnPositions();
  };

  private getHoverDisplayVariables = () => {
    let style = ':host {';
    if (this.hoverDisplay === 'cell') {
      style = style + `--table-cell-hover-display: block;`;
    }
    if (this.hoverDisplay === 'column') {
      style = style + `--table-cell-hover-display: block;`;
      this.hoveredColumnId?.map((c) => {
        style = style + `--table-${c}-cell-hover-display: block;`;
      });
    }
    if (this.hoverDisplay === 'all') {
      style = style + `--table-cell-hover-display: block;`;
      style = style + `--table-row-hover-cell-display: block;`;
      this.hoveredColumnId?.map((c) => {
        style = style + `--table-${c}-cell-hover-display: block;`;
      });
    }
    if (this.hoverDisplay === 'row') {
      style = style + `--table-cell-hover-display: block;`;
      style = style + `--table-row-hover-cell-display: block;`;
    }
    style = style + '}';
    return style;
  };

  private handleScroll = async (e: CustomEvent<{ left: number; top: number }> | Event) => {
    const isCustomEvent = e instanceof CustomEvent;
    if (!isCustomEvent) {
      return;
    }
    this.scroll.emit(e.detail);
    this.verticalScroll = (e as CustomEvent).detail.top;
    this.horizontalScroll = (e as CustomEvent).detail.left;
    await this.getMaxHorizontalScroll();
    this.generateLeftTableColumnPositions();
    this.generateRightTableColumnPositions();
  };

  private getMaxHorizontalScroll = async () => {
    const maxScroll =
      (await this.elm.shadowRoot?.querySelector('br-scroll-area')?.getMaxScroll('horizontal')) || 0;
    return (this.maxScroll = maxScroll - 2);
  };

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        onMouseLeave={() => {
          this.hoveredCell = undefined;
          this.hoveredColumnId = this.highlightedColumnId || undefined;
          this.hoveredRow = undefined;
        }}
      >
        <style>
          {this.hiddenColumnStyles}
          {this.leftPositionStyle}
          {this.rightPositionStyle}
          {this.widthStyle}
          {this.getHoverDisplayVariables()}
        </style>
        <div class={{ 'br-table-wrapper': true, 'br-table-wrapper-with-footer': this.hasFooter }}>
          <div class="br-table-border"></div>
          <br-scroll-area
            onScroll={this.handleScroll}
            allowedScroll="any"
            theme={this.theme}
            style={{ position: 'relative' }}
            overscrollX={this.overscrollX}
            overscrollY={this.overscrollY}
            onScrollStart={(e) => this.scrollStart.emit(e.detail)}
            onScrollStop={(e) => this.scrollStop.emit(e.detail)}
          >
            <table>
              <thead>
                {this.verticalScroll > 0 && (
                  <div class="br-table-header-shadow-container">
                    <div class="br-table-header-shadow-inner-container" />
                  </div>
                )}
                <slot
                  onSlotchange={() => {
                    this.generateTableColumnHiddenStyles();
                    this.generateTableColumnWidths();
                    this.generateLeftTableColumnPositions();
                    this.generateRightTableColumnPositions();
                  }}
                  name="header"
                ></slot>
              </thead>
              <tbody>
                <slot
                  onSlotchange={() => {
                    if (this.sortMode === 'back-end') return;
                    const newRows = Array.from(
                      this.elm.querySelectorAll(
                        'br-table-row',
                      ) as NodeListOf<HTMLBrTableRowElement>,
                    ).filter((c) => c.closest('br-table') === this.elm);
                    const nonExistingRows = this.originalRows.filter((r) => !newRows.includes(r));
                    if (nonExistingRows.length > 0) {
                      // Assumes elements are new and not reordered
                      this.originalRows = newRows;
                      if (!this.sortingDirection) {
                        return;
                      }
                      setTimeout(() => {
                        this.sortTable(this.sortingColumn || '', this.sortingDirection);
                      }, 0);
                    }
                  }}
                ></slot>
              </tbody>
            </table>
          </br-scroll-area>
        </div>
        <slot onSlotchange={this.handleFooterDetection} name="footer"></slot>
      </Host>
    );
  }
}

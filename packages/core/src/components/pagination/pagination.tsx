import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h,
} from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';

/**
 * The Pagination component allows designers and developers to display a series of affordances that represent pages of content. The component renders a dynamic number of affordances based on the total number of pages. Elements that don't fit in will be added to an overflow button that displays excluded elements in a popover.
 * @category Navigation
 */
@Component({
  tag: 'br-pagination',
  styleUrl: 'css/pagination.css',
  shadow: true,
})
export class Pagination implements ComponentInterface {
  @Element() elm: HTMLBrPaginationElement;
  /**
   * Defines the number of pages to display.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() pages: number;
  /**
   * Defines the active page.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ mutable: true }) activePage: number;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the active number of results per page.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ mutable: true }) activeResultsPerPage: number = 10;
  /**
   * Defines the list of possible results per page.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() resultsPerPageOptions: number[] = [10, 50, 100, 200];
  /**
   * Show results per page options.
   */
  @Prop() showResultsPerPageOptions: boolean = true;
  /**
   * An event that emits when the active page changes.
   */
  @Event() activePageChange: EventEmitter<number>;
  /**
   * An event that emits when the active results per page changes.
   */
  @Event() activeResultsPerPageChange: EventEmitter<number>;

  componentWillLoad(): Promise<void> | void {
    if (this.activePage === undefined) {
      this.activePage = this.pages;
    }
  }

  private handlePaginationButtonClick = (direction: 'next' | 'prev') => {
    const modifier = direction === 'next' ? 1 : -1;
    this.activePage = Math.max(1, Math.min(this.pages, this.activePage + modifier));
    this.activePageChange.emit(this.activePage);
  };

  private handleResultsPerPageChange = (e: CustomEvent) => {
    this.activeResultsPerPage = Number(e.detail.value);
    this.activeResultsPerPageChange.emit(this.activeResultsPerPage);
  };

  render() {
    const renderResultsPerPageOptions = () => {
      return (
        <br-single-select
          slot="left-decorator"
          theme={this.theme}
          value={[this.activeResultsPerPage || this.resultsPerPageOptions[0]]}
          onValueChange={this.handleResultsPerPageChange}
        >
          <br-popover theme={this.theme} containHeight={false}>
            <br-button
              shape="Rectangular"
              size="Normal"
              fillStyle="Ghost"
              colorType="Neutral"
              slot="target"
              theme={this.theme}
            >
              <span>{`${this.activeResultsPerPage || this.resultsPerPageOptions[0]}`} / page</span>
              <br-single-select-indicator />
            </br-button>
            <br-popover-content theme={this.theme}>
              <br-select-list fullWidth={true} theme={this.theme}>
                {this.resultsPerPageOptions.map((r) => {
                  return (
                    <br-select-list-item
                      key={r}
                      fullWidth={true}
                      theme={this.theme}
                      shape="Rectangular"
                      size="Normal"
                      value={r}
                    >
                      <span>{r}</span>
                    </br-select-list-item>
                  );
                })}
              </br-select-list>
            </br-popover-content>
          </br-popover>
        </br-single-select>
      );
    };
    return (
      <Host
        style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <br-overflow-wrapper
          overflowButtonPosition="middle"
          order="forward"
          overflowItemProps={{
            fullWidth: true,
            contentAlignment: 'left',
            alignContentToMargins: true,
            width: 'calc(var(--size-unit) * 30)',
            theme: this.theme,
            square: false,
          }}
          visibleItemProps={{
            fullWidth: false,
            contentAlignment: 'center',
            alignContentToMargins: false,
            width: undefined,
            theme: this.theme,
          }}
          theme={this.theme}
        >
          {this.showResultsPerPageOptions &&
            this.resultsPerPageOptions &&
            renderResultsPerPageOptions()}
          <br-button
            theme={this.theme}
            fillStyle="Ghost"
            colorType="Neutral"
            size="Normal"
            slot="left-decorator"
            disabled={this.activePage === 1}
            onClick={() => this.handlePaginationButtonClick('prev')}
          >
            <br-icon iconName="ChevronLeft" slot="left-icon"></br-icon>
          </br-button>
          <br-overflow-ellipsis slot="ellipsis-button" />
          {Array.from({ length: this.pages }, (_, i) => i + 1).map((p) => {
            return (
              <br-button
                theme={this.theme}
                active={p === this.activePage}
                fillStyle="Ghost"
                colorType="Neutral"
                size="Normal"
                key={p}
                square={p.toString().length <= 2}
                onClick={() => {
                  this.activePage = p;
                  this.activePageChange.emit(p);
                }}
              >
                <span>{p}</span>
              </br-button>
            );
          })}
          <br-button
            theme={this.theme}
            fillStyle="Ghost"
            colorType="Neutral"
            size="Normal"
            slot="right-decorator"
            disabled={this.activePage === this.pages}
            onClick={() => this.handlePaginationButtonClick('next')}
          >
            <br-icon iconName="ChevronRight" slot="left-icon"></br-icon>
          </br-button>
        </br-overflow-wrapper>
      </Host>
    );
  }
}

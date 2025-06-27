import {
  Component,
  Host,
  h,
  ComponentInterface,
  Element,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
  Watch,
} from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

// TODO Add support for infinite loop scroll as a boolean prop or compositionally

/**
 * The Scroll Area component handles vertical and horizontal scrolling via a custom scroll bar.
 * @category Layout
 * @slot - Passes content to the Scroll Area.
 */
@Component({
  tag: 'br-scroll-area',
  styleUrl: './css/scroll-area.css',
  shadow: { delegatesFocus: true },
})
export class ScrollArea implements ComponentInterface {
  /**
   * A timer to check if the element is still hovered.
   */
  private scrollTimer: number | undefined;
  /**
   * A reference to the internal scroll container.
   */
  private container: HTMLDivElement | undefined;
  /**
   * A mutation observer to monitor the changes in content.
   */
  private contentMutationObserver: MutationObserver;
  /**
   * A resize observer to monitor the changes in content.
   */
  private contentResizeObserver: ResizeObserver;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrScrollAreaElement;
  /**
   * Whether the scroll has started.
   */
  @State() scrollStarted: boolean;
  /**
   * Stores an interim value when dragging scroll thumbs.
   */
  @State() intialScrollTop: number | undefined;
  /**
   * Stores an interim value when dragging scroll thumbs.
   */
  @State() intialScrollLeft: number | undefined;
  /**
   * Stores vertical ratio of the bar relative to the area.
   */
  @State() verticalRatio: number;
  @Watch('verticalRatio')
  verticalRatioChanged() {
    this.ratioChange.emit({ vertical: this.verticalRatio, horizontal: this.horizontalRatio });
  }
  /**
   * Stores horizontal ratio of the bar relative to the area.
   */
  @State() horizontalRatio: number;
  @Watch('horizontalRatio')
  horizontalRatioChanged() {
    this.ratioChange.emit({ vertical: this.verticalRatio, horizontal: this.horizontalRatio });
  }
  /**
   * Stores whether the scroll area is hovered.
   */
  @State() hovered: boolean;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the scroll y position in px.
   * @category Data
   */
  @Prop({ mutable: true }) scrollY: number;
  /**
   * Defines the scroll X position in px.
   * @category Data
   */
  @Prop({ mutable: true }) scrollX: number;
  /**
   * Determines the type of scrolling allowed.
   * @category Appearance
   */
  @Prop({ reflect: true }) allowedScroll: 'vertical' | 'horizontal' | 'any' | false = 'vertical';
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;
  /**
   * Determines if the scroll bars should be shown on hover.
   * @category Appearance
   */
  @Prop() showScrollBarOnHover?: boolean = true;
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
   * Sets how strictly snap points are enforced on the scroll container in case there is one.
   * @category Behavior
   */
  @Prop({ reflect: true }) scrollSnapType:
    | 'auto'
    | 'x'
    | 'y'
    | 'none'
    | 'block'
    | 'inline'
    | 'both'
    | 'x mandatory'
    | 'y mandatory'
    | 'both mandatory' = 'none';
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
   * Event that triggers when the ratio of the scroll bars change.
   */
  @Event() ratioChange: EventEmitter<{ vertical: number; horizontal: number }>;
  /**
   * Get the max scroll.
   */
  @Method()
  async getMaxScroll(direction?: 'horizontal' | 'vertical'): Promise<number> {
    if (!this.container) {
      return 0;
    }
    const maxX = this.container.scrollWidth - this.elm.offsetWidth;
    const maxY = this.container.scrollHeight - this.elm.offsetHeight;
    return direction === 'horizontal' ? maxX : maxY;
  }
  /**
   * Method to scroll to the end of the scroll area.
   */
  @Method()
  async scrollToEnd(direction?: 'horizontal' | 'vertical'): Promise<void> {
    if (!this.container) {
      return;
    }
    if (direction === 'horizontal') {
      this.container.scrollTo({ left: this.container.scrollWidth });
    } else {
      this.container.scrollTo({ top: this.container.scrollHeight });
    }
  }
  /**
   * Method to scroll to the start of the scroll area.
   */
  @Method()
  async scrollToStart(direction?: 'horizontal' | 'vertical'): Promise<void> {
    if (!this.container) {
      return;
    }
    if (direction === 'horizontal') {
      this.container.scrollTo({ left: 0 });
    } else {
      this.container.scrollTo({ top: 0 });
    }
  }
  /**
   * Method to scroll to coordinates in the scroll area.
   */
  @Method()
  async scrollToCoordinates(
    coordinate: number,
    direction?: 'horizontal' | 'vertical',
  ): Promise<void> {
    if (!this.container) {
      return;
    }
    if (direction === 'horizontal') {
      this.container.scrollTo({ left: coordinate });
    } else {
      this.container.scrollTo({ top: coordinate });
    }
  }

  private setRatios = () => {
    this.verticalRatio = this.elm.offsetHeight / (this.container?.scrollHeight || 1);
    this.horizontalRatio = this.elm.offsetWidth / (this.container?.scrollWidth || 1);
  };

  private scrollTo(options: ScrollOptions): void {
    this.container?.scrollTo(options);
  }

  connectedCallback(): void {
    this.elm.scrollTo = this.scrollTo.bind(this);
  }

  componentWillLoad(): Promise<void> | void {
    this.contentResizeObserver = new ResizeObserver(this.setRatios);
    this.contentMutationObserver = new MutationObserver(this.setRatios);
  }

  componentDidLoad(): Promise<void> | void {
    this.setRatios();
    if (!this.container) {
      return;
    }
    this.contentResizeObserver.observe(this.container);
    this.contentMutationObserver.observe(this.elm, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  disconnectedCallback(): void {
    this.scrollY = 0;
    this.scrollX = 0;
    this.contentMutationObserver?.disconnect();
  }

  private handleVerticalThumbDrag = (e: CustomEvent<number>) => {
    const number = e.detail;
    const newY = (this.intialScrollTop || 0) + number;
    if (!this.container) {
      return;
    }
    this.container?.scrollTo({ top: newY });
  };

  private handleHorizontalThumbDrag = (e: CustomEvent<number>) => {
    const number = e.detail;
    const newX = (this.intialScrollLeft || 0) + number;
    if (!this.container) {
      return;
    }
    this.container.scrollTo({ left: newX });
  };

  private handleBarDragStart = (which?: 'horizontal' | 'vertical') => {
    if (!this.container) {
      return;
    }
    if (which === 'horizontal') {
      this.intialScrollLeft = this.scrollX;
    } else {
      this.intialScrollTop = this.scrollY;
    }
    this.scrollStart.emit({ left: this.scrollX, top: this.scrollY });
  };

  private handleBarDragStop = () => {
    this.intialScrollTop = undefined;
    this.intialScrollLeft = undefined;
    this.scrollStop.emit({ left: this.scrollX, top: this.scrollY });
  };

  private handleMouseOver = () => {
    this.hovered = true;
    this.setRatios();
  };

  private handleMouseOut = () => {
    if (this.intialScrollLeft !== undefined || this.intialScrollTop !== undefined) {
      return;
    }
    this.hovered = false;
  };

  render() {
    const barProps = {
      class: {
        'br-scroll-area-hide-bars': this.showScrollBarOnHover === true && !this.hovered,
      },
      theme: this.theme,
      scrollParent: this.container,
      verticalRatio: this.verticalRatio,
      horizontalRatio: this.horizontalRatio,
      top: this.scrollY,
      left: this.scrollX,
      onMouseOver: this.handleMouseOver,
      onMouseOut: this.handleMouseOut,
      onBarDragStop: this.handleBarDragStop,
    };
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <div
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          ref={(ref) => (this.container = ref)}
          style={{
            overflow: this.allowedScroll === false ? 'visible' : 'auto',
            overscrollBehaviorX: this.overscrollX,
            overscrollBehaviorY: this.overscrollY,
            scrollSnapType: this.scrollSnapType,
          }}
          class={{
            'br-scroll-area-wrapper': true,
          }}
          onScroll={() => {
            if (!this.disabled && this.container) {
              window.clearTimeout(this.scrollTimer);
              if (!this.scrollStarted) {
                this.scrollStart.emit({ left: this.scrollX, top: this.scrollY });
              }
              if (
                this.allowedScroll !== 'vertical' &&
                (this.intialScrollLeft || (!this.intialScrollLeft && !this.intialScrollTop))
              ) {
                const scrollLeft = this.container.scrollLeft;
                this.scrollX = scrollLeft;
              }
              if (
                this.allowedScroll !== 'horizontal' &&
                (this.intialScrollTop || (!this.intialScrollLeft && !this.intialScrollTop))
              ) {
                const scrollTop = this.container.scrollTop;
                this.scrollY = scrollTop;
              }
              this.scroll.emit({ left: this.scrollX, top: this.scrollY });
              this.scrollTimer = undefined;
              this.scrollTimer = window.setTimeout(() => {
                this.scrollStarted = false;
                this.scrollStop.emit({ left: this.scrollX, top: this.scrollY });
              }, 100);
            }
          }}
        >
          <slot></slot>
        </div>
        {this.allowedScroll !== 'horizontal' &&
          this.allowedScroll !== false &&
          this.verticalRatio < 1 && (
            <br-scroll-bar
              style={{
                maxHeight:
                  this.allowedScroll === 'any' ? `calc(100% - var(--scroll-bar-size))` : undefined,
                willChange: 'max-height',
              }}
              {...barProps}
              orientation="vertical"
              onBarDragStart={() => this.handleBarDragStart('vertical')}
              onBarDrag={this.handleVerticalThumbDrag}
            />
          )}
        {this.allowedScroll !== 'vertical' &&
          this.allowedScroll !== false &&
          this.horizontalRatio < 1 && (
            <br-scroll-bar
              style={{
                maxWidth:
                  this.allowedScroll === 'any' ? `calc(100% - var(--scroll-bar-size))` : undefined,
                willChange: 'max-width',
              }}
              {...barProps}
              orientation="horizontal"
              onBarDragStart={() => this.handleBarDragStart('horizontal')}
              onBarDrag={this.handleHorizontalThumbDrag}
            />
          )}
      </Host>
    );
  }
}

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
} from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';

/**
 * The Scroll Bar component is used with the scroll area component to enable a user to scroll through content.
 * @category Layout
 */
@Component({
  tag: 'br-scroll-bar',
  styleUrl: './css/scroll-bar.css',
  shadow: true,
})
export class ScrollBar implements ComponentInterface {
  /**
   * A timeout that tracks when a scroll happens.
   */
  private scrollTimeout: ReturnType<typeof setTimeout>;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrScrollBarElement;
  /**
   * Stores the initial start drag position.
   */
  @State() startDragPosition: number | undefined;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the parent scroll parent the bar is associated with.
   * @category Behavior
   * @visibility hidden
   */
  @Prop() scrollParent: HTMLDivElement | undefined;
  /**
   * Defines the orientation of the component relative to its parent.
   * @category Appearance
   * @visibility hidden
   */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';
  /**
   * Defines the top position relative to the parent.
   * @category Appearance
   * @visibility hidden
   */
  @Prop() top: number;
  /**
   * Defines the left position relative to the parent.
   * @category Appearance
   * @visibility hidden
   */
  @Prop() left: number;
  /**
   * Defines the vertical ratio of the bar relative to the area.
   * @category Appearance
   * @visibility hidden
   */
  @Prop() verticalRatio: number;
  /**
   * Defines the horizontal ratio of the bar relative to the area.
   * @category Appearance
   * @visibility hidden
   */
  @Prop() horizontalRatio: number;
  /**
   * Event that triggers when the scroll bar is dragged.
   */
  @Event() barDrag: EventEmitter<number>;
  /**
   * Event that triggers when the scroll bar drag is started.
   */
  @Event() barDragStart: EventEmitter<void>;
  /**
   * Event that triggers when the scroll bar drag is stopped.
   */
  @Event() barDragStop: EventEmitter<void>;

  private thumbDrag = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isVertical = this.orientation === 'vertical';
    const diff = isVertical
      ? e.clientY - (this.startDragPosition || 0)
      : e.clientX - (this.startDragPosition || 0);
    const factor = isVertical ? this.verticalRatio : this.horizontalRatio;
    this.barDrag.emit(diff / factor);
  };

  private addListeners = () => {
    document.addEventListener('mousemove', this.thumbDrag);
    document.addEventListener('mouseup', this.stopThumbDrag);
  };

  private removeListeners = () => {
    this.startDragPosition = undefined;
    document.removeEventListener('mousemove', this.thumbDrag);
    document.removeEventListener('mouseup', this.stopThumbDrag);
  };

  private stopThumbDrag = () => {
    this.removeListeners();
    this.barDragStop.emit();
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (this.orientation === 'vertical') {
      this.startDragPosition = e.clientY;
    } else {
      this.startDragPosition = e.clientX;
    }
    this.addListeners();
    this.barDragStart.emit();
  };

  private handleClickTrack = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetBox = (e.target as HTMLElement).getBoundingClientRect();
    const isVertical = this.orientation === 'vertical';
    const diff = isVertical ? e.clientY - targetBox.top : e.clientX - targetBox.left;
    const factor = isVertical ? this.verticalRatio : this.horizontalRatio;
    this.barDrag.emit(diff / factor);
  };

  private handleWheelTrack = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isVertical = this.orientation === 'vertical';
    const diff = isVertical ? e.deltaY : e.deltaX;
    const factor = isVertical ? this.verticalRatio : this.horizontalRatio;
    this.barDrag.emit(diff / factor);
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.barDragStop.emit();
    }, 50);
  };

  render() {
    if (this.scrollParent) {
      return (
        <Host>
          <div
            class="br-scroll-bar-track"
            onClick={this.handleClickTrack}
            onWheelCapture={() => this.barDragStart.emit()}
            onWheel={this.handleWheelTrack}
          >
            <div
              onMouseDown={this.handleMouseDown}
              onClick={(e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
              }}
              style={{
                height:
                  this.orientation === 'vertical' ? `${this.verticalRatio * 100}%` : undefined,
                width:
                  this.orientation === 'horizontal' ? `${this.horizontalRatio * 100}%` : undefined,
                top:
                  this.orientation === 'vertical'
                    ? `${(this.top / this.scrollParent.scrollHeight) * 100}%`
                    : undefined,
                left:
                  this.orientation === 'horizontal'
                    ? `${(this.left / this.scrollParent.scrollWidth) * 100}%`
                    : undefined,
                willChange: 'height, width, top, left',
              }}
              class="br-scroll-bar-thumb"
            />
          </div>
        </Host>
      );
    }
  }
}

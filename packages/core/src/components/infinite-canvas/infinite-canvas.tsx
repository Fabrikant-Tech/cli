import {
  Component,
  h,
  ComponentInterface,
  Host,
  Element,
  State,
  Prop,
  Method,
  EventEmitter,
  Event,
} from '@stencil/core';
import { isEqual } from 'lodash-es';

// This id increments for all canvases on the page
let infiniteCanvasId = 0;

/**
 * The Infinite Canvas component displays elements on an infinitely pannable canvas.
 * @category Layout
 * @slot - Passes the content to the canvas.
 */
@Component({
  tag: 'br-infinite-canvas',
  styleUrl: './css/infinite-canvas.css',
  shadow: true,
})
export class InfiniteCanvas implements ComponentInterface {
  /**
   * A reference to the zoom container.
   */
  private zoomContainerRef: HTMLDivElement | undefined;
  /**
   * A timeout for the scroll event.
   */
  private scrollTimeout: ReturnType<typeof setTimeout>;
  /**
   * A timeout for the zoom event.
   */
  private zoomTimeout: ReturnType<typeof setTimeout>;
  /**
   * A timeout for the pan event.
   */
  private panTimeout: ReturnType<typeof setTimeout>;
  /**
   * A timer for the keyboard zoom events.
   */
  private zoomStopTimeout: ReturnType<typeof setTimeout>;
  /**
   * The element reference of the canvas.
   */
  @Element() elm: HTMLBrInfiniteCanvasElement;
  /**
   * Tracks if the canvas has started zooming.
   */
  @State() zooming: boolean = false;
  /**
   * Tracks if the canvas has started panning.
   */
  @State() panning: boolean = false;
  /**
   * Tracks if the canvas has started dragging.
   */
  @State() dragging: boolean;
  /**
   * Tracks the animation duration.
   */
  @State() animationDuration: number | undefined = 0;
  /**
   * Tracks if content is scrolling.
   */
  @State() contentIsScrolling: boolean = false;
  /**
   * Tracks if zoom is active.
   */
  @State() zoomActive: boolean;
  /**
   * Tracks the drag coordinates.
   */
  @State() dragStartCoordinates: [x: number, y: number] = [0, 0];
  /**
   * Tracks the drag start offset.
   */
  @State() dragStartOffset: [x: number, y: number] = [0, 0];
  /**
   * Tracks if the window is in focus.
   */
  @State() windowInFocus: boolean = true;
  /**
   * Tracks the transform origin of the canvas.
   */
  @State() transformOrigin: [x: number, y: number] = [50, 50];
  /**
   * Tracks the x zoom offset.
   */
  @State() zoomOffsetX: number = 0;
  /**
   * Tracks the y zoom offset.
   */
  @State() zoomOffsetY: number = 0;
  /**
   * Whether the canvas actions are disabled.
   * @category State
   */
  @Prop() disabled: boolean | 'pan' | 'zoom';
  /**
   * Whether the canvas pan is active.
   * @category State
   */
  @Prop({ mutable: true }) panActive: boolean;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-infinite-canvas-${infiniteCanvasId++}`;
  /**
   * The coordinates of the canvas.
   * @category State
   */
  @Prop({ mutable: true }) xy: [x: number, y: number] = [0, 0];
  /**
   * Allow wheel panning.
   * @category Behavior
   */
  @Prop() allowWheelPan: boolean = true;
  /**
   * Invert wheel pan.
   * @category Behavior
   */
  @Prop() invertWheelPan: boolean = false;
  /**
   * Invert wheel pan.
   * @category Behavior
   */
  @Prop() invertWheelZoom: boolean = false;
  /**
   * The current level of the zoom.
   * @category State
   */
  @Prop({ reflect: true }) zoom: number = 100;
  /**
   * The default zoom level of the canvas.
   * @category State
   */
  @Prop() defaultZoom?: number;
  /**
   * The default pan coordinates of the canvas.
   * @category State
   */
  @Prop() defaultPan?: [number, number];
  /**
   * Whether to constrain the pan on any direction.
   * @category Behavior
   */
  @Prop() disabledPanAxis?: 'x' | 'y';
  /**
   * The max zoom level.
   * @category State
   */
  @Prop() maxZoom: number = 500;
  /**
   * The min zoom level.
   * @category State
   */
  @Prop() minZoom: number = 25;
  /**
   * The timeout duration for the start, stop events.
   * @category Behavior
   */
  @Prop() startStopTimeout?: number = 300;
  /**
   * The zoom levels that the keyboard zoom spans to. Pass a number to increment in steps equal to the property or pass an array to cycle through the zoom level from smallest to highest.
   * @category Behavior
   */
  @Prop() keyboardZoomSnap: number | number[] = [25, 50, 100, 125, 150, 200, 300, 400, 500];
  /**
   * Allow scrolling in nested elements.
   * @category Behavior
   */
  @Prop() allowScrollInNestedElements?: boolean = true;
  /**
   * Whether keyboard zoom is enabled by using a combination of ctrl or meta key with + and -.
   * @category Behavior
   */
  @Prop() keyboardZoom?: boolean = true;
  /**
   * The time it takes for the canvas to animate to a future state after a method has been called.
   * @category Behavior
   */
  @Prop() transitionDuration?: number;
  /**
   * The pan limit in pixels in all directions around the pan limit origin.
   * @category Behavior
   */
  @Prop() panLimit?: [number, number];
  /**
   * How much of the element needs to be visible for the moveToElement method to trigger.
   * @category Behavior
   */
  @Prop() moveToVisibilityThreshold: number = 50;
  /**
   * Defines alternative widht and height limits to replace the window limits.
   * @category Behavior
   */
  @Prop() sizeLimits?: [number, number];
  /**
   * Emits when the element is panned.
   */
  @Event() panned: EventEmitter<[number, number]>;
  /**
   * Emits when the element pan starts.
   */
  @Event() panStarted: EventEmitter<[number, number]>;
  /**
   * Emits when the element pan stops.
   */
  @Event() panStopped: EventEmitter<[number, number]>;
  /**
   * Emits when the element is zoomed.
   */
  @Event() zoomed: EventEmitter<{ zoom: number; xy: [x: number, y: number] }>;
  /**
   * Emits when the element pan starts.
   */
  @Event() zoomStarted: EventEmitter<{ zoom: number; xy: [x: number, y: number] }>;
  /**
   * Emits when the element pan stops.
   */
  @Event() zoomStopped: EventEmitter<{ zoom: number; xy: [x: number, y: number] }>;

  /**
   * Move to a certain coordinate.
   */
  @Method()
  async moveTo(xy: [number, number], animate?: boolean): Promise<void> {
    if (this.transitionDuration && animate !== false) {
      this.animationDuration = this.transitionDuration;
      setTimeout(() => {
        this.animationDuration = undefined;
      }, this.animationDuration * 1000);
    }
    this.xy = this.getValueLimit(xy);
  }

  /**
   * Zoom in based on the keyboard snap.
   */
  @Method()
  async zoomIn(): Promise<void> {
    this.resolveKeyboardZoomIn();
  }

  /**
   * Zoom out based on the keyboard snap.
   */
  @Method()
  async zoomOut(): Promise<void> {
    this.resolveKeyboardZoomOut();
  }

  /**
   * Zoom to origin.
   */
  @Method()
  async zoomToOrigin(animate?: boolean): Promise<void> {
    if (this.transitionDuration && animate !== false) {
      this.animationDuration = this.transitionDuration;
      setTimeout(() => {
        this.animationDuration = undefined;
      }, this.animationDuration * 1000);
    }
    this.zoomToZero();
  }

  /**
   * Move to a certain zoom level.
   */
  @Method()
  async zoomTo(zoom: number, animate?: boolean): Promise<void> {
    const previousZoom = Number(this.zoom);
    if (this.transitionDuration && animate !== false) {
      this.animationDuration = this.transitionDuration;
      setTimeout(() => {
        this.animationDuration = undefined;
      }, this.animationDuration * 1000);
    }
    this.zoom = zoom;
    const scale = this.zoom / 100;
    const previousScale = previousZoom / 100;
    const containerBox = this.zoomContainerRef?.getBoundingClientRect();
    const containerLeft = containerBox ? containerBox.left : 0;
    const containerTop = containerBox ? containerBox.top : 0;
    const offsetX = this.elm.clientWidth / 2 - containerLeft;
    const offsetY = this.elm.clientHeight / 2 - containerTop;
    this.zoomOffsetX +=
      Math.round(offsetX / previousScale) * previousScale -
      Math.round(offsetX / previousScale) * scale;
    this.zoomOffsetY +=
      Math.round(offsetY / previousScale) * previousScale -
      Math.round(offsetY / previousScale) * scale;

    this.zoomed.emit({ zoom: this.zoom, xy: this.xy });
    this.zoomStopped.emit({ zoom: this.zoom, xy: this.xy });
  }

  /**
   * Move to a certain element at a specific zoom level.
   */
  @Method()
  async moveToElement(
    element: HTMLElement | string,
    zoom?: number,
    animate?: boolean,
    center?: boolean | 'fit',
  ): Promise<void> {
    if (zoom !== undefined) {
      this.zoom = zoom;
    }
    const elm = typeof element === 'string' ? this.elm.querySelector(element) : element;
    if (!elm) {
      return;
    }

    const windowWidthHeight: [number, number] = this.sizeLimits || [
      window.innerWidth,
      window.innerHeight,
    ];
    const containerRefBox = this.elm.getBoundingClientRect();
    const elmBox = elm.getBoundingClientRect();

    const originalScale = this.zoom / 100;

    const doesNotFit =
      elmBox.width * originalScale > windowWidthHeight[0] ||
      elmBox.height * originalScale > windowWidthHeight[1];

    const recalculatedBox = elm.getBoundingClientRect();

    const leftTopCoordinates: [number, number] = [
      -1 * recalculatedBox.left -
        -1 * (this.xy ? this.xy[0] : 0) -
        (-1 * containerRefBox.width) / 2 +
        containerRefBox.left,
      -1 * recalculatedBox.top -
        -1 * (this.xy ? this.xy[1] : 0) -
        (-1 * containerRefBox.height) / 2 +
        containerRefBox.top,
    ];

    const elementHeight = recalculatedBox.height;
    const elementWidth = recalculatedBox.width;

    const newXy: [x: number, y: number] = center
      ? [leftTopCoordinates[0] - elementWidth / 2, leftTopCoordinates[1] - elementHeight / 2]
      : leftTopCoordinates;

    const yVisibilityPercentageTopOverHeight =
      recalculatedBox.top > containerRefBox.height
        ? 0
        : ((containerRefBox.bottom - recalculatedBox.top) / elementHeight) * 100;
    const yVisibilityPercentage =
      recalculatedBox.top < 0
        ? ((recalculatedBox.top + elementHeight) / elementHeight) * 100
        : yVisibilityPercentageTopOverHeight;
    const xVisibilityPercentageLeftOverWidth =
      recalculatedBox.left > containerRefBox.width
        ? 0
        : ((containerRefBox.right - recalculatedBox.left) / elementWidth) * 100;
    const xVisibilityPercentage =
      recalculatedBox.left < 0
        ? ((recalculatedBox.left + elementWidth) / elementWidth) * 100
        : xVisibilityPercentageLeftOverWidth;

    if (
      xVisibilityPercentage <= this.moveToVisibilityThreshold ||
      yVisibilityPercentage <= this.moveToVisibilityThreshold ||
      center
    ) {
      if (!isEqual(newXy, this.xy) || (doesNotFit && center === 'fit')) {
        if (this.transitionDuration && animate !== false) {
          this.animationDuration = this.transitionDuration;
          setTimeout(() => {
            this.animationDuration = undefined;
            if (doesNotFit && center === 'fit') {
              const percentageX = elmBox.width / windowWidthHeight[0];
              const percentageY = elmBox.height / windowWidthHeight[1];
              const whichSize = Math.max(percentageX, percentageY);
              const percentageZoom = this.zoom / whichSize;
              this.zoomTo(percentageZoom, animate);
            }
          }, this.animationDuration * 1000);
        } else {
          setTimeout(() => {
            if (doesNotFit && center === 'fit') {
              const percentageX = elmBox.width / windowWidthHeight[0];
              const percentageY = elmBox.height / windowWidthHeight[1];
              const whichSize = Math.max(percentageX, percentageY);
              const percentageZoom = this.zoom / whichSize;
              this.zoomTo(percentageZoom, animate);
            }
          }, 0);
        }
        this.xy = this.getValueLimit(newXy);
        this.panned.emit(this.xy);
        this.panStopped.emit(this.xy);
      }
    }
  }

  connectedCallback(): void {
    if (this.defaultZoom) {
      this.zoom = this.defaultZoom;
    }
    if (this.defaultPan) {
      this.xy = this.getValueLimit(this.defaultPan);
      if (!isEqual(this.getValueLimit(this.defaultPan), this.defaultPan)) {
        this.panned.emit(this.getValueLimit(this.defaultPan));
      }
    }

    window.addEventListener('scroll', () => {
      if (!this.zoomActive) {
        clearTimeout(this.scrollTimeout);
        this.contentIsScrolling = true;
        this.scrollTimeout = setTimeout(() => {
          this.contentIsScrolling = false;
        }, 300);
      }
    });
    window.addEventListener('scrolling', () => {
      if (!this.zoomActive) {
        clearTimeout(this.scrollTimeout);
        this.contentIsScrolling = true;
        this.scrollTimeout = setTimeout(() => {
          this.contentIsScrolling = false;
        }, 300);
      }
    });
  }

  private getValueLimit = (value: [number, number]): [number, number] => {
    if (!Array.isArray(this.panLimit)) {
      return value;
    }

    const childrenToGetPositionsOf = this.elm.children;

    let leftEdge: number | undefined;
    let rightEdge: number | undefined;
    let topEdge: number | undefined;
    let bottomEdge: number | undefined;

    Array.from(childrenToGetPositionsOf).forEach((n) => {
      const nBox = (n as HTMLElement).getBoundingClientRect();
      const initX = this.xy ? this.xy[0] : 0;
      const initY = this.xy ? this.xy[1] : 0;
      const left = nBox.left - initX;
      const right = nBox.left + nBox.width - initX;
      const top = nBox.top - initY;
      const bottom = nBox.top + nBox.height - initY;

      leftEdge = Math.round(leftEdge ? Math.min(left, leftEdge) : left);
      rightEdge = Math.round(rightEdge ? Math.max(right, rightEdge) : right);
      topEdge = Math.round(topEdge ? Math.min(top, topEdge) : top);
      bottomEdge = Math.round(bottomEdge ? Math.max(bottom, bottomEdge) : bottom);
    });

    const xLimit = this.panLimit[0];
    const yLimit = this.panLimit[1];

    const x = value[0];
    const y = value[1];

    const yHeight = this.elm.offsetHeight;
    const xWidth = this.elm.offsetWidth;

    const yTopLimit =
      topEdge! >= 0 ? yHeight - topEdge! - yLimit : yHeight + -1 * topEdge! - yLimit;
    const yBottomLimit =
      bottomEdge! >= 0 ? -1 * bottomEdge! + yLimit : yHeight + -1 * bottomEdge! - yLimit;
    const xLeftLimit =
      leftEdge! >= 0 ? xWidth - leftEdge! - xLimit : xWidth + -1 * leftEdge! - xLimit;
    const xRightLimit =
      rightEdge! >= 0 ? -1 * rightEdge! + xLimit : xWidth + -1 * rightEdge! - xLimit;

    const xBelowRightLimit = x <= xRightLimit ? xRightLimit : x;
    const yBelowBottomLimit = y <= yBottomLimit ? yBottomLimit : y;
    return [
      x >= xLeftLimit ? xLeftLimit : xBelowRightLimit,
      y >= yTopLimit ? yTopLimit : yBelowBottomLimit,
    ];
  };

  private resolveKeydown = (event: KeyboardEvent) => {
    if ((event.key === ' ' || event.code == 'Space') && !this.panActive) {
      if (!this.disabled || this.disabled === 'zoom') {
        this.panActive = true;
        this.panStarted.emit(this.xy);
      }
    }
  };

  private resolveKeyup = (event: KeyboardEvent) => {
    if (event.code == 'Space') {
      this.panActive = false;
      this.panStopped.emit(this.xy);
    }
  };

  private resolveMousedown = (event: MouseEvent) => {
    const coordinates = [event.clientX, event.clientY];
    const elmBox = this.elm.getBoundingClientRect();
    const elmCoordinates = [elmBox.left, elmBox.top];
    const elmSize = [elmBox.right, elmBox.bottom];
    const isContained =
      coordinates[0] >= elmCoordinates[0] &&
      coordinates[1] > elmCoordinates[1] &&
      elmSize[0] >= coordinates[0] &&
      elmSize[1] >= coordinates[1];
    if (this.panActive && (!this.disabled || this.disabled === 'zoom') && isContained) {
      this.elm.style.cursor = 'var(--cursor-grabbing)';
      this.dragging = true;
      this.dragStartCoordinates = [event.x, event.y];
      this.dragStartOffset = this.xy;
      window.addEventListener('mousemove', this.handleMousemove);
    }
  };

  private resolveMouseup = () => {
    window.removeEventListener('mousemove', this.handleMousemove);
    if (this.dragging) {
      this.dragging = false;
    }
    if (this.panActive) {
      this.elm.style.cursor = 'var(--cursor-grab)';
    } else {
      this.elm.style.cursor = '';
    }
    this.dragStartCoordinates = [0, 0];
  };

  private handleMousemove = (event: MouseEvent) => {
    if (this.panActive && this.dragging) {
      const xDiff =
        this.dragStartCoordinates[0] > event.x
          ? this.dragStartCoordinates[0] - event.x
          : event.x - this.dragStartCoordinates[0];
      const yDiff =
        this.dragStartCoordinates[1] > event.y
          ? this.dragStartCoordinates[1] - event.y
          : event.y - this.dragStartCoordinates[1];
      const xDragCoordinates =
        this.dragStartCoordinates[0] > event.x
          ? this.dragStartOffset[0] - xDiff
          : this.dragStartOffset[0] + xDiff;
      const x = this.disabledPanAxis !== 'x' ? xDragCoordinates : this.xy[0];
      const yDragCoordinates =
        this.dragStartCoordinates[1] > event.y
          ? this.dragStartOffset[1] - yDiff
          : this.dragStartOffset[1] + yDiff;
      const y = this.disabledPanAxis !== 'y' ? yDragCoordinates : this.xy[1];
      this.xy = this.getValueLimit([x, y]);
      this.panned.emit([this.xy[0], this.xy[1]]);
    }
  };

  private handleWheelEvent = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
    if (
      !this.panActive &&
      !event.ctrlKey &&
      !event.metaKey &&
      (!this.disabled || this.disabled === 'zoom')
    ) {
      if (!this.panning) {
        this.panStarted.emit(this.xy);
        this.panning = true;
      }
      clearTimeout(this.panTimeout);
      this.panTimeout = setTimeout(() => {
        this.panning = false;
        this.panned.emit(this.xy);
        this.panStopped.emit(this.xy);
      }, this.startStopTimeout);
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      !this.panActive &&
      (!this.disabled || this.disabled === 'pan')
    ) {
      this.zoomActive = true;
      if (!this.zooming) {
        this.zoomStarted.emit({ zoom: this.zoom, xy: this.xy });
        this.zooming = true;
      }
      clearTimeout(this.zoomTimeout);
      this.zoomTimeout = setTimeout(() => {
        this.zoomActive = false;
        this.zooming = false;
        this.zoomStopped.emit({ zoom: this.zoom, xy: this.xy });
        this.zoomed.emit({ zoom: this.zoom, xy: this.xy });
      }, this.startStopTimeout);
    }

    if (!this.allowScrollInNestedElements) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.zoomActive && (!this.disabled || this.disabled === 'zoom')) {
      if (!this.panActive && !this.dragging && this.allowWheelPan && !this.contentIsScrolling) {
        const modifier = this.invertWheelPan ? 1 : -1;
        const xDiff = event.deltaX;
        const yDiff = event.deltaY;
        const zoomValue = this.zoom < 100 ? (100 - this.zoom + 100) / 100 : 100 / this.zoom;
        const zoomModifier = zoomValue;
        const x =
          this.disabledPanAxis !== 'x'
            ? this.xy[0] + modifier * xDiff * (zoomModifier || 1)
            : this.xy[0];
        const y =
          this.disabledPanAxis !== 'y'
            ? this.xy[1] + modifier * yDiff * (zoomModifier || 1)
            : this.xy[1];
        this.xy = this.getValueLimit([x, y]);
        this.panned.emit([this.xy[0], this.xy[1]]);
      }
    } else {
      if (!this.disabled || this.disabled === 'pan') {
        const zoomDiff = event.deltaY;
        const previousZoom = Number(this.zoom);
        if (event.deltaY !== 0) {
          this.zoom = Math.min(
            this.maxZoom,
            Math.max(
              this.minZoom,
              Math.round(this.zoom + -1 * zoomDiff * (this.invertWheelZoom ? -1 : 1)),
            ),
          );
          const scale = this.zoom / 100;
          const previousScale = previousZoom / 100;
          const containerBox = this.zoomContainerRef?.getBoundingClientRect();
          const containerLeft = containerBox ? containerBox.left : 0;
          const containerTop = containerBox ? containerBox.top : 0;
          const offsetX = event.clientX - containerLeft;
          const offsetY = event.clientY - containerTop;
          this.zoomOffsetX +=
            Math.round(offsetX / previousScale) * previousScale -
            Math.round(offsetX / previousScale) * scale;
          this.zoomOffsetY +=
            Math.round(offsetY / previousScale) * previousScale -
            Math.round(offsetY / previousScale) * scale;
          this.zoomed.emit({ zoom: this.zoom, xy: this.xy });
        }
      }
    }
  };

  private resolveWindowBlur = () => {
    this.windowInFocus = false;
    this.zoomActive = false;
    this.panActive = false;
  };

  private resolveWindowFocus = () => {
    this.windowInFocus = true;
  };

  private resolveKeyboardZoomIn = () => {
    if (!this.disabled || this.disabled === 'pan') {
      this.zoomStarted.emit({ zoom: this.zoom, xy: this.xy });
      const elementBox = this.elm.getBoundingClientRect();
      const leftOffset = elementBox.left;
      const topOffset = elementBox.top;
      const singleSnap = typeof this.keyboardZoomSnap === 'number';
      const previousZoom = Number(this.zoom);
      if (singleSnap) {
        this.zoom = Math.min(
          this.maxZoom,
          Math.max(this.minZoom, Math.round(this.zoom + (this.keyboardZoomSnap as number))),
        );
      } else {
        const currentIndex = (this.keyboardZoomSnap as number[]).findIndex((t, i) => {
          const isFound =
            this.zoom >= t &&
            (i !== (this.keyboardZoomSnap as number[]).length - 1
              ? this.zoom < (this.keyboardZoomSnap as number[])[i + 1]
              : true);
          return isFound;
        });
        this.zoom = (this.keyboardZoomSnap as number[])[
          Math.min((this.keyboardZoomSnap as number[]).length - 1, currentIndex + 1)
        ];
      }
      const scale = this.zoom / 100;
      const previousScale = previousZoom / 100;
      const containerBox = this.zoomContainerRef?.getBoundingClientRect();
      const containerLeft = containerBox ? containerBox.left : 0;
      const containerTop = containerBox ? containerBox.top : 0;
      const offsetX = this.elm.clientWidth / 2 - containerLeft + leftOffset;
      const offsetY = this.elm.clientHeight / 2 - containerTop + topOffset;
      this.zoomOffsetX +=
        Math.round(offsetX / previousScale) * previousScale -
        Math.round(offsetX / previousScale) * scale;
      this.zoomOffsetY +=
        Math.round(offsetY / previousScale) * previousScale -
        Math.round(offsetY / previousScale) * scale;
      this.zoomed.emit({ zoom: this.zoom, xy: this.xy });
      clearTimeout(this.zoomStopTimeout);
      this.zoomStopTimeout = setTimeout(() => {
        this.zoomStopped.emit({ zoom: this.zoom, xy: this.xy });
      }, 10);
    }
  };

  private resolveKeyboardZoomOut = () => {
    if (!this.disabled || this.disabled === 'pan') {
      this.zoomStarted.emit({ zoom: this.zoom, xy: this.xy });
      const elementBox = this.elm.getBoundingClientRect();
      const leftOffset = elementBox.left;
      const topOffset = elementBox.top;
      const singleSnap = typeof this.keyboardZoomSnap === 'number';
      const previousZoom = Number(this.zoom);
      if (singleSnap) {
        this.zoom = Math.max(
          this.minZoom,
          Math.max(this.minZoom, Math.round(this.zoom - (this.keyboardZoomSnap as number))),
        );
      } else {
        const currentIndex = (this.keyboardZoomSnap as number[]).findIndex((t, i) => {
          const isFound =
            this.zoom >= t &&
            (i !== (this.keyboardZoomSnap as number[]).length - 1
              ? this.zoom < (this.keyboardZoomSnap as number[])[i + 1]
              : true);
          return isFound;
        });
        this.zoom = (this.keyboardZoomSnap as number[])[Math.max(0, currentIndex - 1)];
      }
      const scale = this.zoom / 100;
      const previousScale = previousZoom / 100;
      const containerBox = this.zoomContainerRef?.getBoundingClientRect();
      const containerLeft = containerBox ? containerBox.left : 0;
      const containerTop = containerBox ? containerBox.top : 0;
      const offsetX = Math.round(this.elm.clientWidth / 2) - containerLeft + leftOffset;
      const offsetY = Math.round(this.elm.clientHeight / 2) - containerTop + topOffset;
      this.zoomOffsetX +=
        Math.round(offsetX / previousScale) * previousScale -
        Math.round(offsetX / previousScale) * scale;
      this.zoomOffsetY +=
        Math.round(offsetY / previousScale) * previousScale -
        Math.round(offsetY / previousScale) * scale;
      this.zoomed.emit({ zoom: this.zoom, xy: this.xy });

      clearTimeout(this.zoomStopTimeout);
      this.zoomStopTimeout = setTimeout(() => {
        this.zoomStopped.emit({ zoom: this.zoom, xy: this.xy });
      }, 10);
    }
  };

  private zoomToZero = () => {
    if (!this.disabled || this.disabled === 'pan') {
      if (this.zoom !== 100) {
        this.zoom = 100;
        this.zoomOffsetX = 0;
        this.zoomOffsetY = 0;
      } else {
        this.zoom = 100;
        const box = this.zoomContainerRef?.getBoundingClientRect();
        this.xy = this.getValueLimit([
          ((this.elm.offsetWidth - (box ? box.width : 0)) / 2) *
            -1 *
            (this.invertWheelPan ? 1 : -1),
          ((this.elm.offsetHeight - (box ? box.height : 0)) / 2) *
            -1 *
            (this.invertWheelPan ? 1 : -1),
        ]);
        this.zoomOffsetX = 0;
        this.zoomOffsetY = 0;
      }
      this.zoomed.emit({ zoom: this.zoom, xy: this.xy });
      this.zoomStopped.emit({ zoom: this.zoom, xy: this.xy });
    }
  };

  componentWillLoad(): void | Promise<void> {
    window.addEventListener('keydown', this.resolveKeydown);
    window.addEventListener('keyup', this.resolveKeyup);
    window.addEventListener('mousedown', this.resolveMousedown);
    window.addEventListener('mouseup', this.resolveMouseup);
    window.addEventListener('blur', this.resolveWindowBlur);
    window.addEventListener('focus', this.resolveWindowFocus);
  }

  disconnectedCallback(): void {
    window.removeEventListener('keydown', this.resolveKeydown);
    window.removeEventListener('keyup', this.resolveKeyup);
    window.removeEventListener('mousedown', this.resolveMousedown);
    window.removeEventListener('mouseup', this.resolveMouseup);
  }

  private preventChromeGestures = () => {
    document.documentElement.style.overscrollBehaviorX = 'none';
    document.body.style.overscrollBehaviorX = 'none';
  };

  private allowGestures = () => {
    document.documentElement.style.overscrollBehaviorX = '';
    document.body.style.overscrollBehaviorX = '';
  };

  render() {
    return (
      <Host
        onGestureStart={(e: Event) => e.preventDefault()}
        onGestureChange={(e: Event) => e.preventDefault()}
        onWheel={this.handleWheelEvent}
        onMouseOver={this.preventChromeGestures}
        onMouseLeave={this.allowGestures}
        style={{
          cursor: this.panActive ? 'var(--cursor-grab)' : undefined,
          userSelect: this.panActive ? 'none' : undefined,
        }}
      >
        {this.keyboardZoom && (
          <br-keyboard-shortcut
            listenTarget="window"
            keyboardShortcuts={[
              {
                key: '0',
                modifierKey: ['meta'],
                onTrigger: () => {
                  this.zoomToZero();
                },
                preventDefault: true,
                description: 'Zoom to 100%',
              },
              {
                key: '0',
                modifierKey: ['control'],
                onTrigger: () => {
                  this.zoomToZero();
                },
                preventDefault: true,
                description: 'Zoom to 100%',
              },
              {
                key: '=',
                modifierKey: ['control'],
                onTrigger: () => {
                  this.resolveKeyboardZoomIn();
                },
                preventDefault: true,
                description: 'Zoom to next increment',
              },
              {
                key: '=',
                modifierKey: ['meta'],
                onTrigger: () => {
                  this.resolveKeyboardZoomIn();
                },
                preventDefault: true,
                description: 'Zoom to next increment',
              },
              {
                key: '-',
                modifierKey: ['control'],
                onTrigger: () => {
                  this.resolveKeyboardZoomOut();
                },
                preventDefault: true,
                description: 'Zoom to previous increment',
              },
              {
                key: '-',
                modifierKey: ['meta'],
                onTrigger: () => {
                  this.resolveKeyboardZoomOut();
                },
                preventDefault: true,
                description: 'Zoom to previous increment',
              },
            ]}
          />
        )}
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            zIndex: '1',
          }}
        >
          <div
            id={`container-${this.internalId}`}
            ref={(ref) => (this.zoomContainerRef = ref)}
            style={{
              position: 'absolute',
              display: 'block',
              transition: this.animationDuration
                ? `margin ${this.animationDuration}s linear, transform ${this.animationDuration}s linear`
                : undefined,
              marginLeft: `${this.xy[0]}px`,
              marginTop: `${this.xy[1]}px`,
              transformOrigin: `top left`,
              transform: `translate(${this.zoomOffsetX}px, ${this.zoomOffsetY}px) scale3d(${
                this.zoom / 100
              }, ${this.zoom / 100}, ${this.zoom / 100})`,
              pointerEvents: this.zoomActive ? 'none' : undefined,
            }}
          >
            <slot></slot>
          </div>
          <slot name="background"></slot>
        </div>
      </Host>
    );
  }
}

import {
  Component,
  h,
  Host,
  Prop,
  ComponentInterface,
  Event,
  EventEmitter,
  Element,
  Listen,
} from '@stencil/core';
import { getMaxSize, getMinSize } from '../utils/utils';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseFlexboxDirection, BaseSize, BaseSizes } from '../../../reserved/editor-types';
import { DebugMode } from '../../debug/types/utils';

/**
 * The container resize component is used to create resizable layout constructs using containers and container resize handles.
 * @category Layout
 * @slot - Passes the content to the container.
 */
@Component({
  tag: 'br-container-resize-group',
  styleUrl: './css/container-resize-group.css',
  shadow: { delegatesFocus: true },
})
export class ContainerResizeHandle implements ComponentInterface {
  private initialResizeSize: { [key: string]: number } | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrContainerResizeGroupElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   */
  @Prop({ reflect: true }) direction: BaseFlexboxDirection = 'row';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * The min width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) minWidth?: BaseSize<BaseSizes>;
  /**
   * The min height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) minHeight?: BaseSize<BaseSizes>;
  /**
   * The max width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) maxWidth?: BaseSize<BaseSizes>;
  /**
   * The max height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) maxHeight?: BaseSize<BaseSizes>;
  /**
   * Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() shrink?: boolean;
  /**
   * Emits when the resize starts.
   */
  @Event() resizeStarted: EventEmitter<{ [key: string]: number }>;
  /**
   * Emits when the resize happens..
   */
  @Event() resized: EventEmitter<{ [key: string]: number }>;
  /**
   * Emits when the resize stops.
   */
  @Event() resizeStopped: EventEmitter<{ [key: string]: number }>;

  componentWillLoad(): Promise<void> | void {
    const hasResizeHandle = this.elm.querySelector('br-container-resize-handle');
    if (!hasResizeHandle && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`ERROR - The container resize group does not have a resize handle.`, this.elm);
    }
  }

  @Listen('resizeStarted')
  handleResizeStarted(e: CustomEvent<void>) {
    if (e.target === this.elm) {
      return;
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
    const containerSizes: { [key: string]: number } = {};
    const containers = this.elm.querySelectorAll(':scope > br-container');
    const whichSize = this.direction === 'row' ? 'width' : 'height';
    Array.from(containers).forEach((c: HTMLBrContainerElement) => {
      const pixelSize = c.getBoundingClientRect()[whichSize];
      containerSizes[`${c.id ? c.id : c.internalId}`] = pixelSize;
    });
    this.initialResizeSize = containerSizes;
    this.resizeStarted.emit(containerSizes);
  }

  @Listen('resized')
  handleResized(e: CustomEvent<number>) {
    if (!this.initialResizeSize) {
      return;
    }
    if (e.target === this.elm) {
      return;
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
    const whichSize = this.direction === 'row' ? 'width' : 'height';
    const handle = e.target as HTMLElement;
    if (!handle.tagName.toLowerCase().includes('-container-resize-handle')) {
      return;
    }
    const previousElementSibling = handle.previousElementSibling as HTMLBrContainerElement;
    const nextElementSibling = handle.nextElementSibling as HTMLBrContainerElement;

    const value = e.detail;

    const previousElementSiblingSize =
      this.initialResizeSize[
        `${previousElementSibling.id ? previousElementSibling.id : previousElementSibling.internalId}`
      ];
    const nextElementSiblingSize =
      this.initialResizeSize[
        `${nextElementSibling.id ? nextElementSibling.id : nextElementSibling.internalId}`
      ];

    const previousElementMaxSize = getMaxSize(previousElementSibling, whichSize);
    const previousElementMinSize = getMinSize(previousElementSibling, whichSize);
    let previousValue = previousElementSiblingSize + value;
    const nextElementMaxSize = getMaxSize(nextElementSibling, whichSize);
    const nextElementMinSize = getMinSize(nextElementSibling, whichSize);

    let nextValue = nextElementSiblingSize - value;
    const previousElementHasReachedMax = previousElementMaxSize
      ? previousValue > previousElementMaxSize
      : false;
    const previousElementHasReachedMin = previousElementMinSize
      ? previousValue < previousElementMinSize
      : false;
    const nextElementHasReachedMax = nextElementMaxSize ? nextValue > nextElementMaxSize : false;
    const nextElementHasReachedMin = nextElementMinSize ? nextValue < nextElementMinSize : false;

    if (previousElementHasReachedMax) {
      previousValue = previousElementMaxSize!;
    }
    if (nextElementHasReachedMax) {
      nextValue = nextElementMaxSize!;
    }
    if (previousElementHasReachedMin) {
      previousValue = previousElementMinSize!;
    }
    if (nextElementHasReachedMin) {
      nextValue = nextElementMinSize!;
    }

    const containerSizes = { ...this.initialResizeSize };

    const previousElementFlows =
      previousElementSibling[whichSize] === '100%' && previousElementSibling.shrink;
    if (!previousElementFlows) {
      const id = previousElementSibling.id || previousElementSibling.internalId;
      containerSizes[id] = previousValue;
      previousElementSibling[whichSize] = `${previousValue}px`;
    }
    const nextElementFlows = nextElementSibling[whichSize] === '100%' && nextElementSibling.shrink;
    if (!nextElementFlows) {
      const id = nextElementSibling.id || nextElementSibling.internalId;
      containerSizes[id] = nextValue;
      nextElementSibling[whichSize] = `${nextValue}px`;
    }

    this.resized.emit(containerSizes);
  }

  @Listen('resizeStopped')
  handleResizeStopped(e: CustomEvent<void>) {
    if (e.target === this.elm) {
      return;
    }
    e.stopImmediatePropagation();
    e.stopPropagation();

    const containerSizes: { [key: string]: number } = {};
    const containers = this.elm.querySelectorAll(':scope > br-container');
    const whichSize = this.direction === 'row' ? 'width' : 'height';
    Array.from(containers).forEach((c: HTMLBrContainerElement) => {
      const pixelSize = c.getBoundingClientRect()[whichSize];
      containerSizes[`${c.id ? c.id : c.internalId}`] = pixelSize;
    });

    this.resizeStopped.emit(containerSizes);
    this.initialResizeSize = undefined;
  }

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
          minHeight: this.minHeight,
          minWidth: this.minWidth,
          maxHeight: this.maxHeight,
          maxWidth: this.maxWidth,
          flexShrink: this.shrink ? '1' : '0',
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

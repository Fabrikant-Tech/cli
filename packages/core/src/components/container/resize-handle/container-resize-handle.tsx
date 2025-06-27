import {
  Component,
  h,
  Host,
  Prop,
  ComponentInterface,
  Event,
  EventEmitter,
  Element,
} from '@stencil/core';
import { getMaxSize, getMinSize } from '../utils/utils';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseFlexboxDirection } from '../../../reserved/editor-types';

/**
 * The container resize handle component provides a resize affordance in a container resize group component.
 * @category Layout
 * @slot - Passes the content to the container resize handle.
 */
@Component({
  tag: 'br-container-resize-handle',
  styleUrl: './css/container-resize-handle.css',
  shadow: { delegatesFocus: true },
})
export class ContainerResizeHandle implements ComponentInterface {
  private initialPosition: number = 0;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrContainerResizeHandleElement;
  /**
   * The direction the content is displayed in the container.
   */
  @Prop({ reflect: true, mutable: true }) direction: BaseFlexboxDirection = 'column';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * The numeric difference between values.
   */
  @Prop() step: number = 1;
  /**
   * The numeric difference between values when a user moves the handle via keyboard.
   */
  @Prop() largeStep: number = 10;
  /**
   * Whether the handle is shown on hover and focus or it persists.
   */
  @Prop({ reflect: true }) showHandle: boolean | 'hover' = true;
  /**
   * Emits when the resize starts.
   */
  @Event({ cancelable: true }) resizeStarted: EventEmitter<void>;
  /**
   * Emits when the resize happens..
   */
  @Event({ cancelable: true }) resized: EventEmitter<number>;
  /**
   * Emits when the resize stops.
   */
  @Event({ cancelable: true }) resizeStopped: EventEmitter<void>;

  componentWillLoad(): Promise<void> | void {
    this.direction =
      this.elm.closest('br-container-resize-group')?.direction === 'column' ? 'row' : 'column';
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.resizeStarted.emit();
    this.initialPosition = this.direction === 'column' ? e.clientX : e.clientY;
    document.body.style.setProperty('user-select', 'none');
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  private handleMouseMove = (e: MouseEvent) => {
    const position = this.direction === 'column' ? e.clientX : e.clientY;
    const delta =
      position > this.initialPosition
        ? position - this.initialPosition
        : (this.initialPosition - position) * -1;
    this.resized.emit(delta);
  };

  private handleMouseUp = () => {
    document.body.style.removeProperty('user-select');
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.resizeStopped.emit();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' && e.key !== 'Shift') {
      e.preventDefault();
    }
    const moveForward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const moveBackward = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    const shift = e.shiftKey;
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'End' ||
      e.key === 'Home'
    ) {
      this.resizeStarted.emit();

      const previousElement = this.elm.previousElementSibling;
      const nextElement = this.elm.nextElementSibling;

      const currentPreviousSize =
        previousElement?.getBoundingClientRect()[this.direction === 'column' ? 'width' : 'height'];
      const currentNextSize =
        nextElement?.getBoundingClientRect()[this.direction === 'column' ? 'width' : 'height'];

      const maxPreviousSize = getMaxSize(
        previousElement as HTMLBrContainerElement,
        this.direction === 'column' ? 'width' : 'height',
      );
      const minPreviousSize = getMinSize(
        previousElement as HTMLBrContainerElement,
        this.direction === 'column' ? 'width' : 'height',
      );
      const maxNextSize = getMaxSize(
        nextElement as HTMLBrContainerElement,
        this.direction === 'column' ? 'width' : 'height',
      );
      const minNextSize = getMinSize(
        nextElement as HTMLBrContainerElement,
        this.direction === 'column' ? 'width' : 'height',
      );
      const isPreviousElementAContainer = previousElement?.tagName.toLowerCase() === 'br-container';
      const isNextElementAContainer = nextElement?.tagName.toLowerCase() === 'br-container';

      if (e.key === 'End' && maxPreviousSize && isPreviousElementAContainer) {
        const resize = maxPreviousSize - (currentPreviousSize || 0);
        this.resized.emit(resize);
      }
      if (e.key === 'End' && minNextSize && !maxPreviousSize && isNextElementAContainer) {
        const resize = (currentNextSize || 0) - minNextSize;
        this.resized.emit(resize);
      }
      if (e.key === 'Home' && minPreviousSize && isPreviousElementAContainer) {
        const resize = (currentPreviousSize || 0) - minPreviousSize;
        this.resized.emit(resize * -1);
      }
      if (e.key === 'Home' && maxNextSize && !minPreviousSize && isNextElementAContainer) {
        const resize = maxNextSize - (currentNextSize || 0);
        this.resized.emit(resize * -1);
      }

      if (moveForward) {
        this.resized.emit(shift ? this.largeStep : this.step);
      }
      if (moveBackward) {
        this.resized.emit(shift ? this.largeStep * -1 : this.step * -1);
      }

      this.resizeStopped.emit();
    }
  };

  render() {
    return (
      <Host onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
        <div class="br-container-resize-handle-wrapper" tabIndex={0}>
          <slot>
            <div class="br-container-resize-default-handle">
              <br-icon
                iconName={this.direction === 'row' ? 'DotsHorizontal' : 'DotsVertical'}
                size={12}
              />
            </div>
          </slot>
        </div>
      </Host>
    );
  }
}

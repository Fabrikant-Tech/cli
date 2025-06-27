import { ComponentInterface, Element, Event, EventEmitter, Host, Prop } from '@stencil/core';
import { DragAndDropData } from './utils/utils';
import { Component, h } from '@stencil/core';

/**
 * The drag and drop target accepts drag and drop wrapper items.
 * @category Utils
 * @slot - Passes the element for the drop target.
 * @visibility hidden
 */
@Component({
  tag: 'br-drag-and-drop-target',
  styleUrl: 'css/drag-and-drop-target.css',
  shadow: true,
})
export class DragAndDropTarget implements ComponentInterface {
  @Element() elm: HTMLBrDragAndDropTargetElement;

  /**
   * Determines if the drop target is shown in its active state.
   * @category Appearance
   */
  @Prop({ reflect: true, mutable: true }) active: boolean;
  /**
   * Determines the drop target id that controls which elements can be dropped on the target.
   * @category Data
   */
  @Prop() dropTargetId: string;
  /**
   * Event that emits when something is dropped over the target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() drop: EventEmitter<{ data: any }>;
  /**
   * Event that emits when the dragged item enters a valid drop target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() dragEnter: EventEmitter<{ data: any }>;
  /**
   * Event that emits when the dragged item is over a valid drop target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() dragOver: EventEmitter<{ data: any }>;
  /**
   * Event that emits when the dragged item leaves a valid drop target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() dragLeave: EventEmitter<{ data: any }>;

  private resolveDragOver = () => {
    const dragId = DragAndDropData.currentDragWrapper?.dropTargetId;
    const dropTargetId = typeof dragId === 'string' ? dragId : dragId?.id;
    if (dropTargetId !== this.dropTargetId) {
      return;
    }
    this.dragOver.emit(DragAndDropData.currentData);
  };

  private resolveDragEnter = (e: MouseEvent) => {
    const dragId = DragAndDropData.currentDragWrapper?.dropTargetId;
    const dropTargetId = typeof dragId === 'string' ? dragId : dragId?.id;
    if (dropTargetId !== this.dropTargetId) {
      return;
    }
    this.dragEnter.emit(DragAndDropData.currentData);
    e.preventDefault();
    this.active = true;
  };

  private resolveDragLeave = (e: MouseEvent) => {
    e.preventDefault();
    const dragId = DragAndDropData.currentDragWrapper?.dropTargetId;
    const dropTargetId = typeof dragId === 'string' ? dragId : dragId?.id;
    if (dropTargetId === this.dropTargetId) {
      this.dragLeave.emit(DragAndDropData.currentData);
    }
    this.active = false;
  };

  private handleMouseUp = () => {
    this.active = false;
    document.body.style.userSelect = '';
    const dragId = DragAndDropData.currentDragWrapper?.dropTargetId;
    const dropTargetId = typeof dragId === 'string' ? dragId : dragId?.id;
    if (dropTargetId === this.dropTargetId) {
      this.drop.emit(DragAndDropData.currentData);
    }
    DragAndDropData.clearCurrentData();
    DragAndDropData.clearCurrentDragWrapper();
  };

  private internalGetBoundingClientRect() {
    return this.elm.querySelector(':scope > *:not([slot])')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  componentDidLoad(): void {
    this.elm.addEventListener('mouseenter', this.resolveDragEnter);
    this.elm.addEventListener('mouseleave', this.resolveDragLeave);
    this.elm.addEventListener('mousemove', this.resolveDragOver);
    this.elm.addEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <slot name="active"></slot>
      </Host>
    );
  }
}

import { ComponentInterface, Element, Event, Host, Prop, State, EventEmitter } from '@stencil/core';
import { Component, h } from '@stencil/core';
import { DragAndDropData } from '../utils/utils';
import { ZIndexPopover } from '../../../generated/types/variables';
import { deepCloneElement } from '../../animation/utils/utils';
import { BaseComponentIdType } from '../../../reserved/editor-types';

/**
 * The drag and drop wrapper enables dragging elements over a drop target.
 * @category Utils
 * @slot - Passes the element to be dragged.
 * @slot ghost - Passes the element to be displayed in place of the draggable element once dragging starts.
 * @slot drag-ghost - Passes the element to follow the cursor when dragging is active.
 * @visibility hidden
 */
@Component({
  tag: 'br-drag-and-drop-wrapper',
  styleUrl: 'css/drag-and-drop-wrapper.css',
  shadow: true,
})
export class DragAndDropWrapper implements ComponentInterface {
  /**
   * A reference to the drag ghost.
   */
  private dragGhost: HTMLElement | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDragAndDropWrapperElement;
  /**
   * Tracks whether the mouse is down.
   */
  @State() isMouseDown: boolean;
  /**
   * Tracks whether the element is being dragged.
   */
  @State() isDragging: boolean;
  /**
   * Tracks if the elements has a slotted ghost element.
   */
  @State() hasGhost: boolean;
  /**
   * The starting drag coordinates.
   */
  @State() startCoordinates: [number, number];
  /**
   * The data attached to the element that is being dragged.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() dragData: any;
  /**
   * Determines the drop target id that that the element can be dropped on.
   * @category Data
   */
  @Prop() dropTargetId: BaseComponentIdType<HTMLBrDragAndDropTargetElement, string>;
  /**
   * Event that triggers when drag starts.
   */
  @Event() dragStart: EventEmitter<{ x: number; y: number; dragState: DragAndDropData }>;
  /**
   * Event that triggers when drag ends.
   */
  @Event() dragStop: EventEmitter<void>;
  /**
   * Event that triggers when the element is dragged.
   */
  @Event() drag: EventEmitter<{ x: number; y: number; dragState: DragAndDropData }>;

  private internalGetBoundingClientRect() {
    return this.elm.querySelector(':scope > *:not([slot])')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  private addCursorOverride = () => {
    const newStyle = document.createElement('style');
    newStyle.id = 'br-drag-and-drop-wrapper-cursor-override';
    newStyle.innerHTML = `
      :root {
        --cursor-text: grabbing !important;
        --cursor-not-allowed: grabbing !important;
        --cursor-pointer: grabbing !important;
        --cursor-row-resize: grabbing !important;
        --cursor-col-resize: grabbing !important;
        --cursor-grab: grabbing !important;
        --cursor-grabbing: grabbing !important;
        --cursor-default: grabbing !important;
        }
    `;
    document.body.appendChild(newStyle);
  };

  private removeCursorOverride = () => {
    document.getElementById('br-drag-and-drop-wrapper-cursor-override')?.remove();
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (
      (e.target as HTMLElement)?.dataset.draggable === 'false' ||
      (e.target as HTMLElement)?.closest('*[data-draggable="false"]')
    ) {
      return;
    }
    this.hasGhost = !!this.elm.querySelector(':scope > *[slot="ghost"]');
    this.isMouseDown = true;
    const rect = (this.elm.firstElementChild as Element).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.startCoordinates = [x, y];
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
  };

  private handleMouseUp = () => {
    this.isMouseDown = false;
    this.isDragging = false;
    this.dragGhost?.remove();
    this.dragGhost = undefined;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    this.dragStop.emit();
    this.removeCursorOverride();
    DragAndDropData.currentData = undefined;
    DragAndDropData.currentDragWrapper = undefined;
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown && !this.isDragging) {
      const dragGhost = deepCloneElement(
        (this.elm.querySelector(':scope > *[slot="drag-ghost"]') ||
          this.elm.firstElementChild ||
          this.elm) as HTMLElement,
      );
      if (dragGhost) {
        this.dragGhost = dragGhost as HTMLElement;
        document.body.appendChild(this.dragGhost);
        Object.assign(this.dragGhost.style, {
          position: 'fixed',
          left: '-100vw',
          top: '-100vh',
          pointerEvents: 'none',
          willChange: 'left, top',
          zIndex: `calc(${ZIndexPopover} * 100)`,
        });
      }
      DragAndDropData.currentData = this.dragData;
      DragAndDropData.currentDragWrapper = this.elm;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      this.addCursorOverride();
      this.dragStart.emit({ x: e.clientX, y: e.clientY, dragState: this.dragData });
      return (this.isDragging = true);
    }
    if (this.isMouseDown && this.isDragging) {
      if (this.dragGhost) {
        this.drag.emit({ x: e.clientX, y: e.clientY, dragState: this.dragData });
        Object.assign(this.dragGhost.style, {
          left: `${e.clientX - (this.startCoordinates || [0, 0])[0]}px`,
          top: `${e.clientY - (this.startCoordinates || [0, 0])[1]}px`,
          zIndex: `calc(${ZIndexPopover} * 100)`,
        });
      }
    }
  };

  render() {
    return (
      <Host
        draggable={false}
        onMouseDown={this.handleMouseDown}
        class={{
          'br-drag-and-drop-wrapper-mouse-down': this.isMouseDown,
          'br-drag-and-drop-wrapper-dragging': this.isDragging && this.hasGhost,
        }}
      >
        <slot></slot>
        <slot name="ghost"></slot>
        <slot name="drag-ghost"></slot>
      </Host>
    );
  }
}

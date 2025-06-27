import { Component, ComponentInterface, Element, h, Host } from '@stencil/core';
// import { ShortAnimationDuration } from '../../global/types/roll-ups';

/**
 * When a user right clicks on a Context Menu, the component displays a list of actions related to the application state.
 * @category Navigation
 * @slot target - Passes the target to the context menu.
 * @slot - Passes the popover for the context menu.
 */
@Component({
  tag: 'br-context-menu',
  styleUrl: 'css/context-menu.css',
  shadow: true,
})
export class ContextMenu implements ComponentInterface {
  /**
   * A reference to the menu item.
   */
  @Element() elm: HTMLBrContextMenuElement;

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const popover = this.elm.querySelector(`br-popover`);
    if (popover?.isOpen) {
      popover?.closeElement();
    }
    if (!popover) {
      return;
    }
    popover.interaction = 'click';
    popover.showArrow = false;
    popover.trapFocus = true;
    popover.shouldCloseOnClickOutside = true;
    popover.shouldCloseOnESCKey = true;

    popover.openElement({
      width: 1,
      height: 1,
      x: e.clientX,
      y: e.clientY,
      bottom: e.clientY,
      top: e.clientY,
      right: e.clientX,
      left: e.clientX,
    });
  };

  private applyListenerToTarget() {
    this.elm
      ?.querySelector(`*[slot="target"]`)
      ?.addEventListener('contextmenu', this.handleContextMenu);
  }

  componentWillLoad(): Promise<void> | void {
    this.applyListenerToTarget();
  }

  render() {
    return (
      <Host>
        <slot onSlotchange={this.applyListenerToTarget} name="target"></slot>
        <slot></slot>
      </Host>
    );
  }
}

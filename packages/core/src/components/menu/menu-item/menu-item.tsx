import { Component, ComponentInterface, Element, Host, Prop, State, h } from '@stencil/core';
import { MenuItemFilter } from './types/utils';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseColorType } from '../../../reserved/editor-types';

/**
 * The Menu Item is a child of the Menu component. It displays one of the options in a Menu.
 *
 * Refer to the Menu component page for an example of how to pass a Menu Item to a Menu.
 * @category Navigation
 * @parent menu
 * @slot - Passes the button label.
 * @slot left-icon - Passes the left icon.
 * @slot right-icon - Passes the right icon.
 */
@Component({
  tag: 'br-menu-item',
  styleUrl: 'css/menu-item.css',
  shadow: { delegatesFocus: true },
})
export class MenuItem implements ComponentInterface {
  /**
   * A timeout that tracks when a typeahead value change happens.
   */
  private typeaheadTimeout: ReturnType<typeof setTimeout>;
  /**
   * A reference to the typed value.
   */
  @State() typedValue: string = '';
  /**
   * A reference to the menu item.
   */
  @Element() elm: HTMLBrMenuItemElement;
  /**
   * Stores whether the menu item is focused.
   */
  @State() isFocused: boolean = false;
  /**
   * A flag to prevent event event propagation in certain situations.
   */
  @State() preventEventPropagation: boolean | undefined = undefined;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active?: boolean;
  /**
   * Determines if the component is displayed in its hover state.
   * @category State
   */
  @Prop({ reflect: true }) hover?: boolean;
  /**
   * Determines what key combination will be rendered as a shortcut decorator.
   * @category Appearance
   */
  @Prop() shortcut?: `${'cmd' | 'ctrl' | 'alt' | 'shift'}+${string}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Neutral';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Ghost';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Determines if the component is indented.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) indentable?: boolean = false;
  /**
   * Determines if the component is selected.
   * @category Appearance
   */
  @Prop({ reflect: true }) selected?: boolean = false;

  private adjustPopoverParent = () => {
    const popover = this.elm.closest('br-popover');
    const popoverHasOtherTarget = popover?.querySelector("*[slot='target']") !== this.elm;
    if (popover && !popoverHasOtherTarget) {
      popover.interaction = 'hover';
      popover.placement = 'right-start';
      popover.showArrow = false;
      popover.trapFocus = false;
      popover.focusTargetOnClose = false;
      popover.focusContentOnOpen = false;
      popover.shouldCloseOnClickOutside = true;
      popover.shouldCloseOnESCKey = true;
      popover.addEventListener('open', this.openPopover);
      popover.addEventListener('close', this.closePopover);
    }
  };

  private openPopover = (e: CustomEvent) => {
    if (!this.isFocused) {
      window.addEventListener('keydown', this.handleWindowKeyDown);
    }
    if (e.target !== this.elm.closest('br-popover')) {
      return;
    }
    this.active = true;
  };

  private handleWindowKeyDown = (e: KeyboardEvent) => {
    const popover = e.target as HTMLBrPopoverElement;
    const popoverContent = document
      .querySelector(`div[data-parent-popover-id="${popover.internalId}"]`)
      ?.querySelector('br-popover-content');
    if (popoverContent) {
      popoverContent.focus();
    }
  };

  private closePopover = (e: CustomEvent) => {
    if (this.preventEventPropagation === true) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
    setTimeout(() => {
      if (this.preventEventPropagation === true) {
        this.elm.dispatchEvent(e);
        this.preventEventPropagation = false;
        window.removeEventListener('keydown', this.handleWindowKeyDown);
      }
    }, 0);
    this.active = false;
  };

  private preventPropagation = (e: CustomEvent) => {
    (e.target as globalThis.Element).removeEventListener('close', this.preventPropagation);
  };

  componentWillLoad(): Promise<void> | void {
    this.adjustPopoverParent();
  }

  connectedCallback(): void {
    document.body.addEventListener('updateMenuItemFilter', this.handleSharedVariableUpdate);
  }

  disconnectedCallback() {
    this.active = false;
    document.body.removeEventListener('updateMenuItemFilter', this.handleSharedVariableUpdate);
  }

  private getNextMenuItemSibling = (direction: 'forward' | 'backward') => {
    const parentChildren =
      this.elm.slot !== 'target'
        ? this.elm.parentElement?.children
        : this.elm.parentElement?.parentElement?.children;
    if (parentChildren && this.elm.parentElement) {
      const children =
        direction === 'forward' ? Array.from(parentChildren) : Array.from(parentChildren).reverse();
      const currentIndex = children.indexOf(
        this.elm.slot === 'target' ? this.elm.parentElement : this.elm,
      );
      const nextSiblingMenuItem = children.find(
        (child, index) =>
          index > currentIndex &&
          (child.tagName.toLowerCase() === 'br-menu-item' ||
            (child.tagName.toLowerCase() === 'br-popover' &&
              child.firstElementChild?.tagName.toLowerCase() === 'br-menu-item')),
      );
      if (nextSiblingMenuItem) {
        const isPopover = nextSiblingMenuItem.tagName.toLowerCase() === 'br-popover';
        return isPopover
          ? (nextSiblingMenuItem.firstElementChild as HTMLBrMenuItemElement)
          : (nextSiblingMenuItem as HTMLBrMenuItemElement);
      }
    }
    return null;
  };

  private handleSharedVariableUpdate(event: CustomEvent) {
    if (event.detail) {
      MenuItemFilter.currentFilter = event.detail;
      this.typedValue = MenuItemFilter.currentFilter;
    } else {
      MenuItemFilter.clearCurrentFilter();
      this.typedValue = MenuItemFilter.currentFilter;
    }
  }

  private updateFilter = (value: string | undefined) => {
    const event = new CustomEvent('updateMenuItemFilter', {
      detail: value,
      bubbles: true,
      composed: true,
    });
    document.body.dispatchEvent(event);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    let parentElement: HTMLBrMenuItemElement | null = null;
    const directParentPopover = this.elm.closest('br-popover');
    const popoverContent = this.elm.closest('br-popover-content');
    const parentPopoverPortal = popoverContent?.parentElement;
    const parentPopoverId = parentPopoverPortal?.dataset.parentPopoverId;
    let parentPopover: HTMLBrPopoverElement | null = directParentPopover;
    if (parentPopoverId) {
      parentPopover = document.querySelector(
        `br-popover[internal-id="${parentPopoverId}"]`,
      ) as HTMLBrPopoverElement;
      parentElement = parentPopover.querySelector('br-menu-item[slot="target"]');
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      directParentPopover?.closeElement();
      parentPopover?.closeElement();
    }
    if (
      e.key !== 'ArrowDown' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Tab' &&
      new RegExp(/^[a-zA-Z0-9\s]*$/).test(e.key)
    ) {
      const filter = (MenuItemFilter.currentFilter || '') + e.key;

      if (this.typeaheadTimeout) {
        clearTimeout(this.typeaheadTimeout);
      }
      this.updateFilter(filter);

      const hasNesting = this.elm.slot === 'target' && directParentPopover;
      if (hasNesting) {
        const popoverId = directParentPopover.internalId;
        const popoverContent = document
          .querySelector(`div[data-parent-popover-id="${popoverId}"]`)
          ?.querySelector('br-popover-content');
        if (popoverContent) {
          const items = popoverContent.querySelectorAll('br-menu-item');
          const toFocus = Array.from(items).find((item) =>
            item.textContent?.toLowerCase().startsWith(filter),
          );
          if (toFocus) {
            return toFocus.focus();
          }
        }
      }
      const itemParent = hasNesting
        ? directParentPopover.parentElement
        : popoverContent || this.elm.parentElement;
      if (itemParent) {
        const items = itemParent.querySelectorAll('br-menu-item');
        const toFocus = Array.from(items).find((item) =>
          item.textContent?.toLowerCase().startsWith(filter),
        );
        if (toFocus) {
          const shouldClose =
            itemParent === directParentPopover?.parentElement && toFocus !== this.elm;
          if (shouldClose) {
            this.active = false;
            this.preventEventPropagation = true;
            directParentPopover?.addEventListener('close', this.preventPropagation);
            directParentPopover?.closeElement();
          }
          return toFocus.focus();
        }
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      const nextMenuItem = this.getNextMenuItemSibling('forward');
      if (nextMenuItem) {
        if (this.elm.slot === 'target') {
          this.active = false;
          this.preventEventPropagation = true;
          directParentPopover?.addEventListener('close', this.preventPropagation);
          directParentPopover?.closeElement();
        }
        nextMenuItem.focus();
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      const nextMenuItem = this.getNextMenuItemSibling('backward');
      if (nextMenuItem) {
        if (this.elm.slot === 'target') {
          this.active = false;
          this.preventEventPropagation = true;
          directParentPopover?.addEventListener('close', this.preventPropagation);
          directParentPopover?.closeElement();
        }
        nextMenuItem.focus();
      }
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      this.preventEventPropagation = true;
      directParentPopover?.addEventListener('close', this.preventPropagation);
      directParentPopover?.closeElement();
      parentElement?.focus();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (this.elm.slot === 'target' && directParentPopover) {
        const popoverId = directParentPopover.internalId;
        const popoverContent = document
          .querySelector(`div[data-parent-popover-id="${popoverId}"]`)
          ?.querySelector('br-popover-content');
        const firstMenuItem = popoverContent?.querySelector('br-menu-item');
        firstMenuItem?.focus();
      }
    }
  };

  private handleFocus = () => {
    this.typeaheadTimeout = setTimeout(() => {
      this.updateFilter('');
    }, 300);
    this.isFocused = true;
    const directParentPopover = this.elm.closest('br-popover');
    directParentPopover?.openElement();
  };

  private handleKeyUp = () => {
    this.typeaheadTimeout = setTimeout(() => {
      this.updateFilter('');
    }, 300);
  };

  private closeUpwards = (e: globalThis.Event) => {
    const parentElement = this.elm.parentElement;
    if (this.elm.slot === 'target') {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (parentElement) {
        const parentPopover = parentElement.closest('br-popover');
        const popoverContent = document
          .querySelector(`div[data-parent-popover-id="${parentPopover?.internalId}"]`)
          ?.querySelector('br-popover-content');
        if (popoverContent) {
          return popoverContent.querySelector('br-menu-item')?.focus();
        }
      }
    }
    if (parentElement) {
      const parentPopover = parentElement.closest('br-popover');
      if (parentPopover) {
        return parentPopover.closeElement();
      }
      const popoverContent = this.elm.closest('br-popover-content')?.parentElement;
      const popoverId = popoverContent?.dataset.parentPopoverId;
      if (popoverId) {
        const parentPopover = document.querySelector(
          `br-popover[internal-id="${popoverId}"]`,
        ) as HTMLBrPopoverElement;
        parentPopover.closeElement();
      }
    }
  };

  render() {
    return (
      <Host>
        <br-button
          disabled={this.disabled}
          active={this.active}
          alignContentToMargins={true}
          fullWidth={true}
          onFocus={this.handleFocus}
          onBlur={() => (this.isFocused = false)}
          colorType={this.colorType}
          size={this.size}
          shape={this.shape}
          fillStyle={this.fillStyle}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onClick={this.closeUpwards}
        >
          {this.indentable && !this.selected && <br-icon slot="left-icon" />}
          {this.selected && <br-icon iconName="Checkmark" slot="left-icon" />}
          <slot name="left-icon" slot="left-icon"></slot>
          <slot>Content</slot>
          {this.shortcut && (
            <br-tag
              size="Small"
              focusable={false}
              colorType={this.colorType}
              fillStyle="Ghost"
              slot="right-icon"
            >
              {this.shortcut}
            </br-tag>
          )}
          {this.elm.slot === 'target' && <br-icon iconName="ChevronRight" slot="right-icon" />}
          <slot name="right-icon" slot="right-icon"></slot>
        </br-button>
      </Host>
    );
  }
}

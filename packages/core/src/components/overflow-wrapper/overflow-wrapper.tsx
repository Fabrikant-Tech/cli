import { Component, ComponentInterface, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { focusableCustomElements, focusableNativeElements } from '../../utils/utils';

// WHAT HAPPENS WHEN ELEMENTS CHANGE

/**
 * The Overflow component organizes elements in a given amount of space. Elements that don't fit in the given space are hidden behind a popover.
 * @category Layout
 * @slot - Passes the content to the overflow.
 * @slot overflow-header - Passes the content to the overflow header.
 * @slot overflow-footer - Passes the content to the overflow footer.
 * @slot left-decorator - Passes the content to the left side of the content.
 * @slot right-decorator - Passes the content to the right side of the content.
 */
@Component({
  tag: 'br-overflow-wrapper',
  styleUrl: 'css/overflow-wrapper.css',
  shadow: { delegatesFocus: true },
})
export class Overflow implements ComponentInterface {
  /**
   * A mutation observer to monitor the changes in content.
   */
  private contentMutationObserver: MutationObserver;
  /**
   * A resize observer to monitor the changes in content.
   */
  private contentResizeObserver: ResizeObserver;
  /**
   * A list of elements that are children of the footer.
   */
  private elements: HTMLElement[] = [];
  /**
   * A list of elements that are children of the footer.
   */
  private allElementsLength: number = 0;
  /**
   * A reference to the overflow button ref.
   */
  private overflowButtonRef: HTMLBrButtonElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrOverflowWrapperElement;
  /**
   * Resize direction
   */
  @State() resizeDirection: 'smaller' | 'bigger';
  /**
   * Whether the width is being checked.
   */
  @State() checkingSize: number = 0;
  @Watch('checkingSize')
  handleCheckingSizeChanged(newValue: number, oldValue: number) {
    this.resizeDirection = newValue > oldValue ? 'bigger' : 'smaller';
  }
  /**
   * Wheter the popover is open.
   */
  @State() isOpen: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the order of the elements in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() order: 'forward' | 'backward' = 'backward';
  /**
   * Determines where the ellipsis is displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() overflowButtonPosition: 'edge-start' | 'edge-end' | 'middle' = 'edge-start';
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) direction: 'vertical' | 'horizontal' = 'horizontal';
  /**
   * Defines a list of properties to apply to the items that are overflown.
   * @category Appearance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() overflowItemProps?: { [key: string]: any } = {};
  /**
   * Defines a list of properties to apply to the items that are visible.
   * @category Appearance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() visibleItemProps?: { [key: string]: any } = {};

  componentWillLoad(): Promise<void> | void {
    this.allElementsLength = this.elm.children.length;
    this.contentResizeObserver = new ResizeObserver(this.resolveObservers);
    this.contentMutationObserver = new MutationObserver(this.resolveObservers);
  }

  private resolveObservers = () => {
    this.calculateVisibleElements();
  };

  componentDidLoad(): Promise<void> | void {
    this.elements = Array.from(this.elm.querySelectorAll(':scope > *:not([slot])'));
    this.contentResizeObserver.observe(this.elm);
    this.contentMutationObserver.observe(this.elm, { childList: true, subtree: true });
    this.calculateVisibleElements();
  }

  private fromMiddleArray = (items: HTMLElement[], startFrom: 'middle' | 'edges') => {
    const length = items.length;

    if (length === 0) return [];

    const result = [];

    if (startFrom === 'middle') {
      const middle = Math.floor((length - 1) / 2);
      result.push(items[middle]);

      for (let offset = 1; offset <= middle; offset++) {
        if (middle + offset < length) {
          result.push(items[middle + offset]);
        }
        if (middle - offset >= 0) {
          result.push(items[middle - offset]);
        }
      }
    } else {
      let left = 0;
      let right = length - 1;

      while (left <= right) {
        if (left === right) {
          result.push(items[left]);
        } else {
          result.push(items[left], items[right]);
        }
        left++;
        right--;
      }
    }

    return result;
  };
  private calculateVisibleElements = () => {
    const whichValue = this.direction === 'horizontal' ? 'offsetWidth' : 'offsetHeight';
    this.checkingSize = this.elm[whichValue];
    this.elements.forEach((s) => {
      s.removeAttribute('slot');
      if (this.visibleItemProps) {
        Object.keys(this.visibleItemProps).forEach((k) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (s as any)[k] = this.visibleItemProps![k];
        });
      }
    });

    const whichElements =
      this.order === 'backward' ? [...this.elements].reverse() : [...this.elements];
    const elementsToCheck =
      this.overflowButtonPosition === 'middle'
        ? this.fromMiddleArray(whichElements, this.order !== 'backward' ? 'edges' : 'middle')
        : whichElements;

    let currentContentSize = 0;

    const leftDecoratorWidth = Array.from(
      this.elm.querySelectorAll('*[slot="left-decorator"]'),
    ).reduce((acc, el) => acc + (el as HTMLElement)[whichValue], 0);
    const rightDecoratorWidth = Array.from(
      this.elm.querySelectorAll('*[slot="right-decorator"]'),
    ).reduce((acc, el) => acc + (el as HTMLElement)[whichValue], 0);

    const maxContentWidth = this.checkingSize - leftDecoratorWidth - rightDecoratorWidth;

    elementsToCheck.some((s, i) => {
      const ellipsisButton =
        this.elm.querySelector('br-overflow-ellipsis') || this.overflowButtonRef;
      const ellipsisWidth = ellipsisButton?.[whichValue] || 0;

      const multipleSlotValue = i % 2 === 0 ? 'visible-left' : 'visible-right';
      const slotValue =
        this.overflowButtonPosition !== 'middle' ? 'visible-left' : multipleSlotValue;
      const currentHiddenElements = this.elm.querySelectorAll(':scope *[slot="overflow"]');
      if (this.resizeDirection === 'bigger') {
        if (
          maxContentWidth -
            ellipsisWidth *
              (currentHiddenElements.length === 1 && i === elementsToCheck.length - 1 ? 0 : 1) >
          currentContentSize + s[whichValue]
        ) {
          s.setAttribute('slot', slotValue);
          currentContentSize += s[whichValue];
        } else {
          s.setAttribute('slot', 'overflow');
          if (this.overflowItemProps) {
            Object.keys(this.overflowItemProps).forEach((k) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (s as any)[k] = this.overflowItemProps![k];
            });
          }
        }
      } else {
        s.setAttribute('slot', slotValue);
        currentContentSize += s[whichValue];
        if (maxContentWidth < currentContentSize + ellipsisWidth) {
          s.setAttribute('slot', 'overflow');
          if (this.overflowItemProps) {
            Object.keys(this.overflowItemProps).forEach((k) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (s as any)[k] = this.overflowItemProps![k];
            });
          }
        }
      }
    });
  };

  private focusFirstElement = () => {
    const overflowElements =
      Array.from(this.elm.querySelectorAll(':scope > *[slot="overflow"]')) || [];
    const elements =
      this.order === 'backward' ? [...overflowElements].reverse() : [...overflowElements];
    if (elements.length > 0) {
      (elements[0] as HTMLElement).focus();
    }
  };

  private handleKeyDownOverflowButton = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && this.isOpen) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      (
        (this.elm.querySelector(':scope > *[slot="ellipsis-button"]') as HTMLElement) ||
        this.overflowButtonRef
      )?.click();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      return (this.isOpen = !this.isOpen);
    }
    if (this.isOpen && e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusFirstElement();
    }
  };

  private handleKeyDownOverflowContent = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      (
        (this.elm.querySelector(':scope > *[slot="ellipsis-button"]') as HTMLElement) ||
        this.overflowButtonRef
      )?.click();
    }
    const overflowElements =
      Array.from(this.elm.querySelectorAll(':scope > *[slot="overflow"]')) || [];
    const focusableElements = overflowElements.filter(
      (el) =>
        focusableNativeElements.includes(el.tagName.toLowerCase()) ||
        focusableCustomElements.includes(el.tagName.toLowerCase()),
    );
    const elements =
      this.order === 'backward' ? [...focusableElements].reverse() : [...focusableElements];
    const currentIndex = elements.findIndex(
      (el) => el === this.elm.shadowRoot?.activeElement || el === e.target,
    );
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentIndex === elements.length - 1) {
        return;
      }
      (elements[currentIndex + 1] as HTMLElement).focus();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex === 0) {
        return;
      }
      (elements[currentIndex - 1] as HTMLElement).focus();
    }
  };

  private childrenChanged = () => {
    if (this.allElementsLength !== this.elm.children.length) {
      this.elements.forEach((s) => {
        s.removeAttribute('slot');
      });
      this.elements = Array.from(this.elm.querySelectorAll(':scope > *:not([slot])'));
      this.allElementsLength = this.elm.children.length;
      this.calculateVisibleElements();
    }
  };

  render() {
    const hasOverflow = (this.elm.querySelectorAll(':scope > *[slot="overflow"]') || []).length > 0;
    const renderPopover = () => {
      return (
        <br-popover
          focusContentOnOpen={true}
          focusTargetOnClose={true}
          trapFocus={false}
          class="br-overflow-button-popover"
          tabindex={!hasOverflow ? -1 : undefined}
          style={{
            display: !hasOverflow ? 'block' : undefined,
            overflow: !hasOverflow ? 'hidden' : undefined,
            width: !hasOverflow ? '0px' : undefined,
            height: !hasOverflow ? '0px' : undefined,
          }}
          onOpen={() => {
            this.isOpen = true;
          }}
          onClose={() => (this.isOpen = false)}
          showArrow={false}
          placement="bottom"
          portalDestination={'inline'}
          containHeight={true}
        >
          <div
            slot="target"
            tabindex={!hasOverflow ? -1 : 0}
            onFocus={() => {
              (
                (this.elm.querySelector(':scope > *[slot="ellipsis-button"]') as HTMLElement) ||
                this.overflowButtonRef
              )?.focus();
            }}
            onKeyDown={this.handleKeyDownOverflowButton}
          >
            <slot name="ellipsis-button"></slot>
          </div>
          <br-popover-content onKeyDown={this.handleKeyDownOverflowContent}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <slot name="overflow-header"></slot>
              <div
                style={{
                  display: 'flex',
                  flexDirection: this.order === 'backward' ? 'column-reverse' : 'column',
                }}
              >
                <slot name="overflow"></slot>
              </div>
              <slot name="overflow-footer"></slot>
            </div>
          </br-popover-content>
        </br-popover>
      );
    };
    return (
      <Host>
        <slot name="left-decorator"></slot>
        <div
          class="br-overflow-wrapper-visible-container"
          style={{
            flexDirection: this.direction === 'horizontal' ? 'row' : 'column',
          }}
        >
          {this.overflowButtonPosition === 'edge-start' && renderPopover()}
          <slot name="visible-left"></slot>
          {this.overflowButtonPosition === 'middle' && renderPopover()}
          <slot name="visible-right"></slot>
          {this.overflowButtonPosition === 'edge-end' && renderPopover()}
        </div>
        <div
          class="br-overflow-wrapper-hidden-container"
          style={{
            flexDirection: this.direction === 'horizontal' ? 'row' : 'column',
          }}
        >
          <div
            class="br-overflow-wrapper-hidden-items"
            style={{
              flexDirection: this.direction === 'horizontal' ? 'row' : 'column',
            }}
          >
            <slot onSlotchange={this.childrenChanged}></slot>
          </div>
        </div>
        <slot name="right-decorator"></slot>
      </Host>
    );
  }
}

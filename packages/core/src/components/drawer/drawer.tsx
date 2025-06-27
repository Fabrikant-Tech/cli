import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { ShortAnimationDuration } from '../../global/types/roll-ups';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { focusFirstFocusableElement, trapFocus, deepQuerySelectorAll } from '../../utils/utils';
import { isEmpty } from 'lodash-es';
import {
  BaseHorizontalPosition,
  BasePositionType,
  BaseVerticalPosition,
} from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';

// This id increments for all buttons on the page
let drawerId = 0;

/**
 * The Drawer component displays content relative to a target when a particular action occurs.
 * @category Overlays & Modals
 * @slot - Passes content to the Drawer.
 * @slot target - Passes the target element of the Drawer.
 */
@Component({
  tag: 'br-drawer',
  styleUrl: './css/drawer.css',
  shadow: true,
})
export class Drawer {
  /**
   * An internal reference to the target.
   */
  private target: Element | null;
  /**
   * An internal reference to the content wrapper.
   */
  private contentWrapper: HTMLDivElement | undefined;
  /**
   * An internal reference to the drawer content component.
   */
  private content: Element | null;
  /**
   * An internal reference to whether the drawer is controlled.
   */
  private isControlled: boolean = false;
  /**
   * Stores whether the drawer is the root.
   */
  @State() isRootDrawer: boolean;
  /**
   * Whether this popover has open popovers.
   */
  @State() hasDrawerOpenImmediatelyInside: HTMLBrDrawerElement | null;
  /**
   * Store the maximum of value of any drawer stack index on screen.
   */
  @State() maxDrawerStackIndex: number | undefined;
  @Watch('maxDrawerStackIndex')
  handleMaxDrawerStackIndexChange() {
    const minStackindex = this.getMinDrawerStackIndex();
    this.isRootDrawer = minStackindex === Number(this.elm.dataset.stackIndex);
    if (this.content) {
      (this.content as HTMLBrDrawerContentElement).root = this.isRootDrawer;
    }
  }
  /**
   * State for the hover state.
   */
  @State() isHovered: boolean;
  /**
   * State for whether the drawer has already opened.
   */
  @State() hasOpened: boolean;
  @Watch('hasOpened')
  handleHasOpenedChange(newValue: boolean) {
    if (newValue) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      setTimeout(() => {
        if (this.contentWrapper && this.focusContentOnOpen) {
          focusFirstFocusableElement(this.contentWrapper);
        }
      }, ShortAnimationDuration);
    }
  }
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDrawerElement;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-drawer-${drawerId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines whether the component closes when a click happens outside of it.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() shouldCloseOnClickOutside: boolean = true;
  /**
   * Determines whether the component closes when ESC is pressed.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() shouldCloseOnESCKey: boolean = true;
  /**
   * Determines whether the component is open.
   * @category State
   * @visibility persistent
   */
  @Prop({ reflect: true, mutable: true }) isOpen?: boolean;
  @Watch('isOpen')
  handleIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (!this.isControlled) {
        if (newValue) {
          document.body.addEventListener('click', this.handleBodyClick);
          document.body.addEventListener('keydown', this.handleBodyKeyDown);
          setTimeout(() => {
            if (this.contentWrapper && this.focusContentOnOpen) {
              focusFirstFocusableElement(this.contentWrapper);
            }
          }, ShortAnimationDuration);
        }
      }
      if (!newValue) {
        document.body.removeEventListener('click', this.handleBodyClick);
        document.body.removeEventListener('keydown', this.handleBodyKeyDown);
      }
      if (this.isControlled) {
        this.setStackIndex();
        if (newValue) {
          this.openOrUpdateDrawer();
        } else {
          this.closeDrawer();
        }
      }
    }
  }
  /**
   * Determines where the component is rendered when opened.
   * @category Behavior
   */
  @Prop({ reflect: true }) portalDestination?: globalThis.Element | 'inline' | 'root' = 'root';
  /**
   * Determines the strategy for positioning the component.
   * @category Behavior
   */
  @Prop({ reflect: true }) strategy?: 'absolute' | 'fixed' = 'fixed';
  /**
   * Determines whether the component traps focus.
   * @category Behavior
   */
  @Prop() trapFocus?: boolean = true;
  /**
   * Determines whether the component focuses the target when it closes.
   * @category Behavior
   */
  @Prop() focusTargetOnClose?: boolean = true;
  /**
   * Determines whether the component focuses the content when it opens.
   * @category Behavior
   */
  @Prop() focusContentOnOpen?: boolean = true;
  /**
   * Defines a classname to be applied to the content.
   * @category Behavior
   */
  @Prop() contentClassname?: string;
  /**
   * Determines the placement of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() placement: BasePositionType<BaseHorizontalPosition | BaseVerticalPosition> = 'right';
  /**
   * Determines if other open components of the same type should close when this component closes.
   * @category Behavior
   */
  @Prop() closesOtherDrawers?: boolean;
  /**
   * Event that emits when the drawer opens.
   */
  @Event() open!: EventEmitter<void>;
  /**
   * Event that emits when the drawer closes.
   */
  @Event() close!: EventEmitter<void>;
  /**
   * A method to open the drawer.
   */
  @Method()
  async openElement(): Promise<void> {
    if (this.target) {
      return;
    }
    this.openOrUpdateDrawer();
  }
  /**
   * A method to close the drawer.
   */
  @Method()
  async closeElement(): Promise<void> {
    this.closeDrawer();
  }
  /**
   * A method to update the maxStackIndex externally.
   */
  @Method()
  async setInternalMaxDrawerStackIndex(value: number | undefined): Promise<void> {
    this.maxDrawerStackIndex = value;
  }

  private internalGetBoundingClientRect() {
    return this.contentWrapper?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    window.addEventListener('popstate', this.cleanupPopstate);
    this.isControlled = this.isOpen !== undefined;
    if (this.isControlled && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This drawer is in controlled mode.`, this.elm);
    }
    this.updateTargetReference();
  }

  componentDidLoad() {
    if (this.isControlled && this.isOpen) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      this.setStackIndex();
      this.openOrUpdateDrawer();
    }
  }

  disconnectedCallback() {
    if (this.isOpen) {
      this.cleanupPopstate();
    }
    if (this.target instanceof globalThis.Element) {
      this.target?.removeEventListener('click', () => this.handleTargetClick());
    }
  }

  private getMinDrawerStackIndex = () => {
    const drawerStackIndexElement = deepQuerySelectorAll('br-drawer[data-stack-index]');
    const drawerElements = drawerStackIndexElement.length > 0 ? drawerStackIndexElement : undefined;
    const drawerIndexes = drawerElements
      ? drawerElements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [0];
    return Math.min(...drawerIndexes);
  };

  private setMaxDrawerStackIndex = () => {
    const drawerStackIndexElement = deepQuerySelectorAll('br-drawer[data-stack-index]');
    const drawerElements = drawerStackIndexElement.length > 0 ? drawerStackIndexElement : undefined;
    const drawerIndexes = drawerElements
      ? drawerElements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [0];
    this.maxDrawerStackIndex = Math.max(...drawerIndexes);
    drawerElements?.forEach((drawer) => {
      if (drawer !== this.elm) {
        (drawer as HTMLBrDrawerElement).setInternalMaxDrawerStackIndex(this.maxDrawerStackIndex);
      }
    });
  };

  // A function that tracks the order in which the drawers have opened to determine the closing order
  private setStackIndex = () => {
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement.length > 0 ? stackIndexElement : undefined;
    const indexes = elements
      ? elements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [-1];

    const maxIndex = Math.max(...indexes);

    if (this.contentWrapper) {
      this.elm.dataset.stackIndex = (maxIndex + 1).toString();
    }
  };

  // A function that resets the drawer's stack index
  private resetStackIndex = () => {
    if (this.contentWrapper) {
      delete this.elm.dataset.stackIndex;
      this.setMaxDrawerStackIndex();
    }
  };

  // Uses autoupdate to recalculate the position
  private autoUpdatePosition = () => {
    if (this.contentWrapper) {
      if (this.contentWrapper) {
        Object.assign(this.contentWrapper.style, {
          width: 'max-content',
          display: 'block',
        });
        // Do on next tick to avoid flicker
        setTimeout(() => {
          if (!this.hasOpened) {
            this.hasOpened = true;
            this.open.emit();
            this.setMaxDrawerStackIndex();
          }
          Object.assign(this.contentWrapper!.style, {
            visibility: 'visible',
          });
        }, 0);
      }
    }
  };

  private closeOtherDrawers = () => {
    const drawers = deepQuerySelectorAll('br-drawer');
    this.setMaxDrawerStackIndex();
    drawers.forEach((drawer: HTMLBrDrawerElement) => {
      if (drawer.internalId !== this.elm.internalId) {
        drawer.closeElement();
      }
    });
  };

  // Handles moving the drawer content to the root or another specified portal destination
  private openOrUpdateDrawer = () => {
    if (this.contentWrapper && this.content) {
      if (!this.isControlled || (this.isControlled && this.isOpen)) {
        if (this.portalDestination === 'inline') {
          this.content.classList.add('br-drawer-content-inline');
        }
        if (this.portalDestination && this.portalDestination !== 'inline') {
          const targetRoot =
            this.portalDestination === 'root' ? document.body : this.portalDestination;
          if (!targetRoot.contains(this.contentWrapper)) {
            targetRoot.append(this.contentWrapper);
            this.contentWrapper.append(this.content);
          }
        }
        this.autoUpdatePosition();
        if (!this.isOpen) {
          this.isOpen = true;
          this.setMaxDrawerStackIndex();
          if (this.closesOtherDrawers) {
            this.closeOtherDrawers();
          }
        }
      }
      if (this.isControlled) {
        this.open.emit();
        this.setMaxDrawerStackIndex();
        if (this.closesOtherDrawers) {
          this.closeOtherDrawers();
        }
      }
    }
  };

  // Moves the drawer content back to the original drawer root
  private closeDrawer = () => {
    if (this.contentWrapper && this.content) {
      if (!this.isControlled || (this.isControlled && !this.isOpen)) {
        if (this.portalDestination !== 'inline') {
          if (!this.elm.shadowRoot?.contains(this.contentWrapper)) {
            this.elm.shadowRoot?.append(this.contentWrapper);
            this.elm.append(this.content);
          }
        }
        this.resetStackIndex();
        Object.assign(this.contentWrapper!.style, {
          display: 'none',
          visibility: 'hidden',
        });
        if (this.isOpen) {
          this.isOpen = false;
          this.close.emit();
          this.hasOpened = false;
          if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
            this.target.focus({ preventScroll: true });
          }
        }
      }
    }
    if (this.isControlled) {
      if (this.isOpen) {
        this.close.emit();
      }
      this.hasOpened = false;
      if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
        this.target.focus({ preventScroll: true });
      }
    }
  };

  // When the target is clicked update the stack index and open or close the drawer
  private handleTargetClick = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdateDrawer();
    } else {
      this.closeDrawer();
    }
  };

  // Determines if the drawer should be closed after a certain interaction
  private maybeCloseDrawer = (
    e: globalThis.KeyboardEvent | globalThis.MouseEvent,
    skipContainedFork?: boolean,
  ) => {
    const target = e.target;
    const currentTarget = e.currentTarget;

    const path = e.composedPath();
    const pathTarget = path.filter((n) => (n as globalThis.Element).slot === 'target');
    const isOverlay = (e.target as globalThis.Element)?.classList.contains('br-drawer-overlay');
    const isContained =
      (target && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (currentTarget && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (!isEmpty(pathTarget) && this.elm.contains(pathTarget[0] as globalThis.Element));
    if (
      !isOverlay &&
      ((isContained && !skipContainedFork) || this.hasDrawerOpenImmediatelyInside)
    ) {
      return;
    }

    // Include drawer shadow root elements
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement;
    const indexes = elements.map((e) => Number((e as HTMLElement).dataset.stackIndex));
    const maxIndex = Math.max(...indexes);

    if (maxIndex.toString() === this.elm.dataset.stackIndex) {
      this.closeDrawer();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  // Check if the drawer should be closed when ESC is pressed
  private handleBodyKeyDown = (e: globalThis.KeyboardEvent) => {
    if (this.shouldCloseOnESCKey) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.maybeCloseDrawer(e, true);
      }
    }
  };

  // Check if the drawer should be closed when the body of the document is clicked
  private handleBodyClick = (e: globalThis.MouseEvent) => {
    if (
      this.shouldCloseOnClickOutside &&
      !this.elm.contains(e.target as globalThis.Element) &&
      (!this.target || (this.target && this.target !== e.target)) &&
      !this.content?.contains(e.target as globalThis.Element)
    ) {
      this.maybeCloseDrawer(e);
    }
  };

  // Cleans up and closes the drawer when the popstate event fires
  private cleanupPopstate() {
    this.isControlled = false;
    this.isOpen = undefined;
    this.closeDrawer();
  }

  // Updates the target reference when the target element changes and on load
  private updateTargetReference = (t?: globalThis.Element) => {
    const target = t || this.elm.querySelector(':scope > *[slot="target"]');
    this.target = target;
    const contents = this.elm.querySelector('br-drawer-content');
    this.content = contents;
    if (this.content) {
      (this.content as HTMLBrDrawerContentElement).placement = this.placement;
    }
    if (this.target instanceof globalThis.Element) {
      this.target.addEventListener('click', this.handleTargetClick);
    }
  };

  private getMaxIndexDrawerHeight = () => {
    const index = this.maxDrawerStackIndex;
    const element = document.querySelector(`br-drawer[data-stack-index="${index}"]`);
    const id = element?.getAttribute('internal-id');
    const drawerContent = document.querySelector(`*[data-parent-drawer-id="${id}"]`);
    const drawerContentElement = drawerContent?.querySelector('br-drawer-content');
    const height = drawerContentElement?.clientHeight;
    return height;
  };

  private handleOverlayClick = (e: globalThis.MouseEvent) => {
    if (this.shouldCloseOnClickOutside) {
      this.maybeCloseDrawer(e);
    }
  };

  render() {
    const isTopDrawer =
      !this.maxDrawerStackIndex ||
      (this.maxDrawerStackIndex && Number(this.elm.dataset.stackIndex) >= this.maxDrawerStackIndex);
    const calculatedModifier = (modifier: number) =>
      this.maxDrawerStackIndex && Number(this.elm.dataset.stackIndex) < this.maxDrawerStackIndex
        ? 1 - (this.maxDrawerStackIndex - Number(this.elm.dataset.stackIndex)) * modifier
        : 1;
    const calculatedTransformModifier = (modifier: number) =>
      this.maxDrawerStackIndex && Number(this.elm.dataset.stackIndex) < this.maxDrawerStackIndex
        ? (this.maxDrawerStackIndex - Number(this.elm.dataset.stackIndex)) * modifier
        : 1;
    const placementStyles =
      (this.placement === 'right' && {
        top: '0px',
        right: '0px',
      }) ||
      (this.placement === 'left' && {
        top: '0px',
        left: '0px',
      }) ||
      (this.placement === 'top' && {
        top: '0px',
        left: '0px',
        right: '0px',
      }) ||
      (this.placement === 'bottom' && {
        bottom: '0px',
        left: '0px',
        right: '0px',
      });
    const transformDirection = this.placement === 'top' || this.placement === 'bottom' ? 'Y' : 'X';
    const transformDirectionModifier =
      this.placement === 'top' || this.placement === 'left' ? '-' : '';
    return (
      <Host>
        <div
          data-parent-drawer-id={this.internalId}
          ref={(ref) => (this.contentWrapper = ref)}
          class={{
            'br-drawer-content-wrapper-open': this.isOpen === true,
            'br-drawer-content-wrapper': true,
            'br-theme-dark': this.theme === 'Dark',
            [`${this.contentClassname}`]: this.contentClassname !== undefined,
          }}
          onKeyDown={(e) => {
            if (this.contentWrapper && this.trapFocus && isTopDrawer) {
              trapFocus(this.contentWrapper, e);
            }
          }}
          style={{
            position: this.strategy,
            width: 'max-content',
            pointerEvents: 'none',
            display: 'none',
            height: '100vh',
            visibility: 'hidden',
            zIndex: 'var(--z-index-modals)',
            transition: 'var(--transition-default)',
            ...(placementStyles ? placementStyles : {}),
          }}
          {...{
            onMouseOver: () => {
              this.isHovered = true;
            },
            onMouseLeave: () => {
              this.isHovered = false;
            },
            onOpen: (e: CustomEvent) => {
              this.hasDrawerOpenImmediatelyInside = e.target as HTMLBrDrawerElement;
            },
            onClose: (e: CustomEvent) => {
              const target = e.target as HTMLBrDrawerElement;
              if (this.elm !== target) {
                if (this.hasDrawerOpenImmediatelyInside === target) {
                  this.hasDrawerOpenImmediatelyInside = null;
                }
              }
            },
          }}
        >
          {!this.isOpen && (
            <style>{`*[data-parent-drawer-id="${this.internalId}"] > br-drawer-content { 
                opacity: 1;
                transform: translate${transformDirection}(${transformDirectionModifier}5%);
            }`}</style>
          )}
          {!isTopDrawer && this.isOpen && (
            <style>{`*[data-parent-drawer-id="${this.internalId}"] > br-drawer-content { 
                opacity: ${calculatedModifier(0.2)};
                filter: brightness(${calculatedModifier(0.1)});
                height: ${this.getMaxIndexDrawerHeight()}px;
                transform-origin: ${(this.placement === 'right' && 'left') || (this.placement === 'left' && 'right') || ''};
                transition: transform var(--transition-short-duration) linear, opacity var(--transition-short-duration) linear, scale var(--transition-short-duration) linear;
                transform: translate${transformDirection}(${transformDirectionModifier === '-' ? '' : '-'}${10 * calculatedTransformModifier(0.5)}px);
            }`}</style>
          )}
          <slot></slot>
          {this.isRootDrawer && (
            <div
              class="br-drawer-overlay"
              style={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                backgroundColor: 'color-mix(in srgb, var(--color-black) 90%, transparent)',
                pointerEvents: isTopDrawer ? 'auto' : 'none',
                ...(placementStyles ? placementStyles : {}),
                zIndex: '0',
              }}
              onClick={this.handleOverlayClick}
            />
          )}
        </div>
        <div class="br-drawer-target-wrapper">
          <slot onSlotchange={() => this.updateTargetReference()} name="target"></slot>
        </div>
      </Host>
    );
  }
}

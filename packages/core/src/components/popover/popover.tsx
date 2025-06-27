import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  Coords,
  Elements,
  flip,
  FloatingElement,
  hide,
  limitShift,
  Middleware,
  offset,
  Placement,
  ReferenceElement,
  shift,
  size,
} from '@floating-ui/dom';
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
import { POPOVER_ARROW_SIZE, PopoverTargetBox } from './types/popover-types';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  focusFirstFocusableElement,
  getSafeAreaTriangle,
  trapFocus,
  deepQuerySelectorAll,
  isElementContained,
} from '../../utils/utils';
import { isEmpty } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

//TODO Possibly implement https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
//TODO Possibly implement has opened events

// This id increments for all buttons on the page
let popoverId = 0;

/**
 * The Popover component displays content relative to a target when a particular action occurs.
 * @category Overlays & Modals
 * @slot - Passes content to the Popover.
 * @slot target - Passes the target element of the Popover.
 */
@Component({
  tag: 'br-popover',
  styleUrl: './css/popover.css',
  shadow: true,
})
export class Popover {
  /**
   * A mutation observer for the target.
   */
  private targetObserver: MutationObserver | undefined = undefined;
  /**
   * A timer to check if the element is still hovered.
   */
  private hoverTimer: number | undefined;
  /**
   * An internal reference to the target.
   */
  private target:
    | Element
    | {
        getBoundingClientRect(): PopoverTargetBox;
      }
    | null;
  /**
   * An internal reference to the content wrapper.
   */
  private contentWrapper: HTMLDivElement | undefined;
  /**
   * An internal reference to the popover content component.
   */
  private content: Element | null;
  /**
   * An internal reference to the arrow wrapper.
   */
  private arrow: HTMLDivElement | undefined;
  /**
   * An internal reference to whether the popover is controlled.
   */
  private isControlled: boolean = false;
  /**
   * An internal reference to the placement of the popover after calculations have happened.
   */
  private actualPlacement: Placement;
  /**
   * Whether this popover has open popovers.
   */
  @State() hasPopoverOpenImmediatelyInside: HTMLBrPopoverElement | null;
  /**
   * State for the arrow.
   */
  @State() triangle: Array<{ x: number; y: number }> | undefined;
  /**
   * State for the hover state.
   */
  @State() isHovered: boolean;
  /**
   * State for whether the popover has already opened.
   */
  @State() hasOpened: boolean;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrPopoverElement;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-popover-${popoverId++}`;
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
   * Determines whether the target should be activated on hover.
   * Accepts a true or false value which sets the target active prop to true or a string value for the attribute that should be set to true.
   * @category Behavior
   */
  @Prop() activateTargetOnOpen?: boolean | string;
  /**
   * Determines whether the component is open.
   * @category State
   * @visibility persistent
   */
  @Prop({ reflect: true, mutable: true }) isOpen?: boolean;
  @Watch('isOpen')
  handleIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (newValue) {
        document.body.addEventListener('click', this.handleBodyClick);
        document.body.addEventListener('keydown', this.handleBodyKeyDown);
        document.body.addEventListener('mousemove', this.handleMouseMove);
        setTimeout(() => {
          if (this.contentWrapper && this.focusContentOnOpen) {
            focusFirstFocusableElement(this.contentWrapper);
          }
        }, 100);
      } else {
        document.body.removeEventListener('click', this.handleBodyClick);
        document.body.removeEventListener('keydown', this.handleBodyKeyDown);
        document.body.removeEventListener('mousemove', this.handleMouseMove);
      }
      if (this.target && this.activateTargetOnOpen) {
        if (typeof this.activateTargetOnOpen === 'string') {
          (this.target as HTMLElement).setAttribute(this.activateTargetOnOpen, newValue.toString());
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this.target as any).active = newValue;
        }
      }
      if (this.isControlled && newValue !== oldValue) {
        if (newValue) {
          this.openOrUpdatePopopver();
        } else {
          this.closePopover();
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
  @Prop({ reflect: true }) strategy?: 'absolute' | 'fixed';
  /**
   * Determines the placement of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() placement: Placement = 'bottom';
  /**
   * Determines the interaction that triggers the component.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() interaction: 'hover' | 'click' = 'click';
  /**
   * Determines if the arrow is displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showArrow: boolean = true;
  /**
   * Determines the x and y offset the component is displayed from the target.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() offset?: [number, number];
  /**
   * Determines if the component is constrained to the width of the target.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) constrainToTargetWidth?: boolean = false;
  /**
   * Determines if the component should flip if it goes off screen.
   * @category Appearance
   */
  @Prop() flip?: boolean = true;
  /**
   * Determines if the component should shift if it goes off screen.
   * @category Appearance
   */
  @Prop() shift?: 'overlap' | true;
  /**
   * The min width in px or reference to the target.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) minWidth: number | 'reference' | false = 'reference';
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
   * Determines if the component should fit the content in the available height either side of the target.
   * @category Appearance
   */
  @Prop({ reflect: true }) containHeight: boolean = true;
  /**
   * Determines if other open components of the same type should close when this component closes.
   * @category Behavior
   */
  @Prop() closesOtherPopovers?: boolean;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;
  /**
   * Determines the timeout before the component closes when the mouse leaves the target.
   * @category Behavior
   * @visibility hidden
   */
  @Prop() hoverTimerDuration?: number;
  /**
   * Event that emits when the popover opens.
   */
  @Event({ cancelable: true }) open!: EventEmitter<void>;
  /**
   * Event that emits when the popover closes.
   */
  @Event({ cancelable: true }) close!: EventEmitter<void>;
  /**
   * A method to open the popover.
   */
  @Method()
  async openElement(anchor?: globalThis.Element | PopoverTargetBox): Promise<void> {
    if (this.target && anchor) {
      return;
    }
    if (this.disabled || this.isOpen) {
      return;
    }
    if (anchor) {
      const createVirtualElement = (a: PopoverTargetBox) => {
        const exists = document.getElementById(`virtual-${this.internalId}`);
        exists?.remove();
        const div = document.createElement('div');
        div.id = `virtual-${this.internalId}`;
        div.style.position = this.strategy || 'absolute';
        div.style.top = `${a.y}px`;
        div.style.left = `${a.x}px`;
        div.style.width = `${a.width}px`;
        div.style.height = `${a.height}px`;
        div.style.opacity = '0';
        div.style.pointerEvents = 'none';
        document.body.appendChild(div);
        return div;
      };
      this.target = anchor instanceof globalThis.Element ? anchor : createVirtualElement(anchor);
      if (this.target instanceof globalThis.Element) {
        this.setStackIndex();
        this.updateTargetReference(this.target);
      }
      this.openOrUpdatePopopver();
    } else {
      this.setStackIndex();

      if (!this.isOpen) {
        this.openOrUpdatePopopver();
      }
    }
  }
  /**
   * A method to close the popover.
   */
  @Method()
  async closeElement(): Promise<void> {
    this.closePopover();
  }

  private internalGetBoundingClientRect() {
    return this.contentWrapper?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    window.addEventListener('popstate', this.cleanupPopstate);
    this.isControlled = this.isOpen !== undefined;
    if (this.isControlled && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This popover is in controlled mode.`, this.elm);
    }
    this.updateTargetReference();
  }

  componentDidLoad() {
    if (this.isControlled && this.isOpen) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      this.setStackIndex();
      this.openOrUpdatePopopver();
    }
  }

  connectedCallback() {
    this.updateTargetReference();
  }

  disconnectedCallback() {
    if (this.isOpen) {
      this.cleanupPopstate();
    }
    if (this.target instanceof globalThis.Element) {
      this.target?.removeEventListener('click', () => this.handleTargetClick());
      this.target?.removeEventListener('mouseover', () => this.handleTargetHover());
    }
    document.body.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  // A function that tracks the order in which the popovers have opened to determine the closing order
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

  // A function that resets the popover's stack index
  private resetStackIndex = () => {
    if (this.contentWrapper) {
      delete this.elm.dataset.stackIndex;
    }
  };

  // Determines the position of the arrow relative to the popover
  private calculateArrowPositioning = (
    arrow: globalThis.HTMLElement,
    placement: Placement,
    middlewareArrow: Partial<Coords> & {
      centerOffset: number;
      alignmentOffset?: number;
    },
  ) => {
    const { x: setX, y: setY } = middlewareArrow;
    const arrowRotation =
      (placement.includes('left') && 'rotate(-90deg)') ||
      (placement.includes('top') && 'rotate(0deg)') ||
      (placement.includes('right') && 'rotate(90deg)') ||
      (placement.includes('bottom') && 'rotate(180deg)') ||
      '';

    const left = (setX && `${setX}px`) || (placement.includes('right') && `0px`) || null;
    const right = placement.includes('left') && !left ? '0px' : null;
    const top = (setY && `${setY}px`) || (placement.includes('bottom') && `0px`) || null;
    const bottom = placement.includes('top') && !top ? '0px' : null;
    const translate =
      (placement.includes('right') && 'translateX(-100%)') ||
      (placement.includes('left') && 'translateX(100%)') ||
      (placement.includes('bottom') && 'translateY(-100%)') ||
      (placement.includes('top') && 'translateY(100%)');

    Object.assign(arrow.style, {
      left,
      top,
      right,
      bottom,
      transform: `${translate} ${arrowRotation}`,
    });
  };

  // Calculates the position of the popover relative to the target and other set constraints
  private calculatePopoverPosition = async () => {
    if (this.target instanceof globalThis.Element && this.contentWrapper && this.isOpen) {
      const middlewareToApply = [
        ...(this.flip ? [flip()] : []),
        ...(this.containHeight
          ? [
              size({
                apply({
                  availableHeight,
                  elements,
                }: {
                  availableHeight: number;
                  elements: {
                    reference: ReferenceElement;
                    floating: FloatingElement;
                  };
                }) {
                  Object.assign(elements.floating.style, {
                    boxSizing: 'border-box',
                    maxHeight: `${availableHeight}px`,
                  });
                },
              }),
            ]
          : []),
        ...(this.placement ? [] : [autoPlacement()]),
        ...(this.shift
          ? [shift({ crossAxis: this.shift === 'overlap', limiter: limitShift() })]
          : []),
        ...(this.minWidth
          ? [
              {
                name: 'minWidth',
                fn: ({ elements }: { elements: Elements }) => {
                  const width =
                    this.minWidth === 'reference'
                      ? (elements.reference as HTMLElement).offsetWidth
                      : this.minWidth;
                  Object.assign(elements.floating.style, {
                    minWidth: `${width}px`,
                  });
                  return width;
                },
              },
            ]
          : []),
        ...((this.arrow && [
          arrow({ element: this.arrow }),
          offset({
            mainAxis: POPOVER_ARROW_SIZE + (this.offset ? this.offset[0] : 0),
            crossAxis: 0 + (this.offset ? this.offset[1] : 0),
          }),
        ]) ||
          (this.offset && [offset({ mainAxis: this.offset[0], crossAxis: this.offset[1] })]) ||
          []),
        hide(),
      ];
      computePosition(this.target, this.contentWrapper, {
        placement: this.placement,
        strategy: this.strategy,
        middleware: [...(middlewareToApply as Array<Middleware | null | undefined | false>)],
      }).then(({ middlewareData, x, y, placement }) => {
        this.actualPlacement = placement;
        if (this.contentWrapper) {
          Object.assign(this.contentWrapper.style, {
            top: `${y}px`,
            left: `${x}px`,
            width: this.constrainToTargetWidth
              ? `${this.target?.getBoundingClientRect().width}px`
              : 'max-content',
            display: 'block',
          });
          // Do on next tick to avoid flicker
          setTimeout(() => {
            if (!this.isControlled && !this.hasOpened) {
              this.hasOpened = true;
              this.open.emit();
            }
            Object.assign(this.contentWrapper!.style, {
              visibility: 'visible',
            });
          }, 0);
        }
        if (middlewareData.arrow && this.arrow) {
          this.calculateArrowPositioning(this.arrow, this.actualPlacement, middlewareData.arrow);
        }
      });
    }
  };

  // Uses autoupdate to recalculate the position
  private autoUpdatePosition = () => {
    if (this.disabled) {
      return;
    }

    if (this.target && this.contentWrapper) {
      autoUpdate(this.target, this.contentWrapper, () => this.calculatePopoverPosition());
    }
  };

  private closeOtherPopovers = () => {
    const popovers = deepQuerySelectorAll('br-popover');
    popovers.forEach((popover) => {
      if (popover !== this.elm) {
        (popover as HTMLBrPopoverElement).closeElement();
      }
    });
  };

  // Handles moving the popover content to the root or another specified portal destination
  private openOrUpdatePopopver = () => {
    if (this.disabled) {
      return;
    }
    if (this.target && this.contentWrapper && this.content) {
      if (!this.isControlled || (this.isControlled && this.isOpen)) {
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
          if (this.closesOtherPopovers) {
            this.closeOtherPopovers();
          }
        }
      }
      if (this.isControlled) {
        this.open.emit();
        if (this.closesOtherPopovers) {
          this.closeOtherPopovers();
        }
      }
    }
  };

  // Moves the popover content back to the original popover root
  private closePopover = () => {
    if (this.disabled) {
      return;
    }
    if (this.target && this.contentWrapper && this.content) {
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
          top: `0px`,
          left: `0px`,
        });
        if (this.isOpen) {
          this.isOpen = false;
          this.close.emit();
          this.hasOpened = false;
          this.updateTargetReference();
          if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
            this.target.focus({ preventScroll: true });
          }
        }
      }
    }
    if (this.isControlled) {
      this.close.emit();
      this.hasOpened = false;
      this.updateTargetReference();
      if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
        this.target.focus({ preventScroll: true });
      }
    }

    const exists = document.getElementById(`virtual-${this.internalId}`);
    exists?.remove();
  };

  // When the target is clicked update the stack index and open or close the popover
  private handleTargetClick = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdatePopopver();
    } else {
      this.closePopover();
    }
  };

  // When the target is hovered update the stack index and open the popover
  private handleTargetHover = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdatePopopver();
    }
  };

  // Determines if the popover should be closed after a certain interaction
  private maybeClosePopover = (
    e: globalThis.KeyboardEvent | globalThis.MouseEvent,
    skipContainedFork?: boolean,
  ) => {
    if (this.hasPopoverOpenImmediatelyInside) {
      if (!this.hasPopoverOpenImmediatelyInside.isOpen) {
        this.hasPopoverOpenImmediatelyInside = null;
      }
    }
    const target = e.target;
    const currentTarget = e.currentTarget;
    const path = e.composedPath();
    const pathTarget = path.filter((n) => (n as globalThis.Element).slot === 'target');
    const isContained =
      (target && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (currentTarget && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (!isEmpty(pathTarget) && this.elm.contains(pathTarget[0] as globalThis.Element));

    if ((isContained && !skipContainedFork) || this.hasPopoverOpenImmediatelyInside) {
      return;
    }

    if (
      !isEmpty(pathTarget) &&
      !this.elm.contains(pathTarget[0] as globalThis.Element) &&
      !isContained
    ) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      return this.closePopover();
    }

    // Include popover shadow root elements
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement;
    const indexes = elements.map((e) => Number((e as HTMLElement).dataset.stackIndex));
    const maxIndex = Math.max(...indexes);

    if (maxIndex.toString() === this.elm.dataset.stackIndex) {
      if (target && isElementContained(target as HTMLElement, this.contentWrapper)) {
        return;
      }
      this.closePopover();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  // Check if the popover should be closed when ESC is pressed
  private handleBodyKeyDown = (e: globalThis.KeyboardEvent) => {
    if (this.shouldCloseOnESCKey) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.maybeClosePopover(e, true);
      }
    }
  };

  // Check if the popover should be closed when the body of the document is clicked
  private handleBodyClick = (e: globalThis.MouseEvent) => {
    if (
      this.shouldCloseOnClickOutside &&
      !this.elm.contains(e.target as globalThis.Element) &&
      this.target !== e.target
    ) {
      this.maybeClosePopover(e);
    }
  };

  private disableHover = () => {
    if (this.hasPopoverOpenImmediatelyInside || this.isHovered) {
      return;
    }
    this.closePopover();
    this.triangle = undefined;
  };

  private handleMouseMove = (e: globalThis.MouseEvent) => {
    if (
      this.contentWrapper &&
      this.target &&
      this.target instanceof globalThis.Element &&
      this.interaction === 'hover'
    ) {
      window.clearTimeout(this.hoverTimer);

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const targetBox = this.target.getBoundingClientRect();

      const contentBox = this.contentWrapper.getBoundingClientRect();
      const triangle = getSafeAreaTriangle(
        this.actualPlacement,
        this.contentWrapper,
        mouseX,
        mouseY,
      );
      const isOverTarget =
        mouseX >= targetBox.left &&
        mouseX <= targetBox.right &&
        mouseY >= targetBox.top &&
        mouseY <= targetBox.bottom;
      const isOverContent =
        mouseX >= contentBox.left &&
        mouseX <= contentBox.right &&
        mouseY >= contentBox.top &&
        mouseY <= contentBox.bottom;

      if (isOverTarget) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = undefined;
        return (this.triangle = triangle);
      }

      if (isOverContent) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = undefined;
        return (this.triangle = undefined);
      }

      if (!isOverContent && !isOverTarget && !this.hasPopoverOpenImmediatelyInside) {
        this.triangle = undefined;
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = undefined;
      }

      this.hoverTimer = undefined;
      this.hoverTimer = window.setTimeout(() => this.disableHover(), this.hoverTimerDuration || 20);
    }
  };

  // Cleans up and closes the popover when the popstate event fires
  private cleanupPopstate() {
    this.isControlled = false;
    this.isOpen = undefined;
    this.closePopover();
  }

  private mutationCallback = (mutationList: MutationRecord[]) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removedNodes = Array.from(mutation.removedNodes) as HTMLElement[];
        const targetRemoved = removedNodes.includes(this.target as HTMLElement);
        if (targetRemoved) {
          this.cleanupPopstate();
        }
      }
    });
  };

  // Updates the target reference when the target element changes and on load
  private updateTargetReference = (t?: globalThis.Element) => {
    const target = t || this.elm.querySelector(':scope > *[slot="target"]');
    this.targetObserver?.disconnect();
    this.targetObserver = undefined;
    this.targetObserver = new MutationObserver(this.mutationCallback);
    this.target = target;
    if (target) {
      this.targetObserver.observe(this.elm, { childList: true, subtree: true });
    }

    const contents = this.elm.querySelector('br-popover-content');
    this.content = contents;
    if (this.target instanceof globalThis.Element) {
      if (this.interaction === 'click') {
        this.target.addEventListener('click', this.handleTargetClick);
      } else {
        this.target.addEventListener('click', this.handleTargetClick);
        this.target.addEventListener('mouseover', this.handleTargetHover);
      }
    }
  };

  // This implements an arrow as a resource that supports proper shadow vs other hacks like svgs and/or css triangles
  private renderPopoverArrow = () => {
    const proportionRatio = 0.7079166667;
    return (
      <div
        ref={(ref) => (this.arrow = ref)}
        id="arrow"
        style={{
          display: 'inline-flex',
          position: 'absolute',
          width: `${POPOVER_ARROW_SIZE}px`,
          height: `${POPOVER_ARROW_SIZE}px`,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'space-around',
          pointerEvents: 'none',
          zIndex: `calc(var(--z-index-popover) + 1)`,
        }}
      >
        <div
          style={{
            height: `${POPOVER_ARROW_SIZE * proportionRatio}px`,
            width: `${POPOVER_ARROW_SIZE * proportionRatio}px`,
            transform: `translateY(-${POPOVER_ARROW_SIZE / 2 + 1}px)`,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-popover-background)',
              height: `${POPOVER_ARROW_SIZE * proportionRatio}px`,
              width: `${POPOVER_ARROW_SIZE * proportionRatio}px`,
              boxShadow: `var(--elevation-shadow-popover)`,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <Host>
        <div
          data-parent-popover-id={this.internalId}
          data-placement={this.placement}
          ref={(ref) => (this.contentWrapper = ref)}
          class={{
            'br-popover-content-wrapper-open': this.isOpen === true,
            'br-popover-content-wrapper': true,
            'br-theme-dark': this.theme === 'Dark',
            [`${this.contentClassname}`]: this.contentClassname !== undefined,
          }}
          onKeyDown={(e) => {
            if (this.contentWrapper && this.trapFocus) {
              trapFocus(this.contentWrapper, e);
            }
          }}
          style={{
            position: 'absolute',
            width: 'max-content',
            display: 'none',
            top: `0px`,
            left: `0px`,
            visibility: 'hidden',
            zIndex: 'var(--z-index-popover)',
          }}
          {...{
            onMouseOver: () => {
              this.isHovered = true;
            },
            onMouseLeave: () => {
              this.isHovered = false;
            },
            onFocus: () => {
              this.isHovered = true;
            },
            onOpen: (e: CustomEvent) => {
              this.hasPopoverOpenImmediatelyInside = e.target as HTMLBrPopoverElement;
            },
            onClose: (e: CustomEvent) => {
              const target = e.target as HTMLBrPopoverElement;
              if (this.elm !== target) {
                if (this.hasPopoverOpenImmediatelyInside === target) {
                  this.hasPopoverOpenImmediatelyInside = null;
                  this.hoverTimer = undefined;
                  this.hoverTimer = window.setTimeout(
                    () => this.disableHover(),
                    this.hoverTimerDuration || 20,
                  );
                }
              }
            },
          }}
        >
          <slot></slot>
          <svg
            width="100%"
            height="100%"
            style={{
              zIndex: '0',
              // pointerEvents: this.triangle ? 'all' : 'none',
              pointerEvents: 'none',
              position: 'fixed',
              top: '0',
              left: '0',
            }}
          >
            {this.triangle && (
              <polygon
                points={`${this.triangle[0].x},${this.triangle[0].y} ${this.triangle[1].x},${this.triangle[1].y} ${this.triangle[2].x},${this.triangle[2].y}`}
                fill="color-mix(in srgb, red 0%, transparent)"
              />
            )}
          </svg>
          {this.showArrow && this.renderPopoverArrow()}
        </div>
        <div class="br-popover-target-wrapper">
          <slot onSlotchange={() => this.updateTargetReference()} name="target"></slot>
        </div>
      </Host>
    );
  }
}

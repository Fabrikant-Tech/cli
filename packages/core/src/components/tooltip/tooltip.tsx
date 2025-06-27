import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  Coords,
  flip,
  hide,
  limitShift,
  offset,
  Placement,
  shift,
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
import { TOOLTIP_ARROW_SIZE, TooltipTargetBox } from './types/tooltip-types';
import {
  ColorName,
  ColorsWithNoShades,
  ColorShadeNameDefault,
  getAllUniqueShadeNames,
  ColorShadeName,
} from '../../global/types/roll-ups';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  focusFirstFocusableElement,
  getSafeAreaTriangle,
  trapFocus,
  deepQuerySelectorAll,
} from '../../utils/utils';
import { isEmpty } from 'lodash-es';
import { toKebabCase } from '../container/utils/utils';
import {
  BaseColorType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorNameShadeType,
} from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';

//TODO Possibly implement https://developer.mozilla.org/en-US/docs/Web/API/Tooltip_API

// This id increments for all buttons on the page
let tooltipId = 0;

/**
 * The Tooltip component displays content relative to a target when a particular action occurs.
 * @category Overlays & Modals
 * @slot - Passes content to the Tooltip.
 * @slot target - Passes the target element of the Tooltip.
 */
@Component({
  tag: 'br-tooltip',
  styleUrl: './css/tooltip.css',
  shadow: true,
})
export class Tooltip {
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
        getBoundingClientRect(): TooltipTargetBox;
      }
    | null;
  /**
   * An internal reference to the content wrapper.
   */
  private contentWrapper: HTMLDivElement | undefined;
  /**
   * An internal reference to the content wrapper.
   */
  private content: Element | null;
  /**
   * An internal reference to the arrow wrapper.
   */
  private arrow: HTMLDivElement | undefined;
  /**
   * An internal reference to whether the tooltip is controlled.
   */
  private isControlled: boolean = false;
  /**
   * An internal reference to the placement of the tooltip after calculations have happened.
   */
  private actualPlacement: Placement;
  /**
   * State for the arrow.
   */
  @State() triangle: Array<{ x: number; y: number }> | undefined;
  /**
   * State for the hover state.
   */
  @State() isHovered: boolean;
  /**
   * State for whether the tooltip has already opened.
   */
  @State() hasOpened: boolean;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTooltipElement;

  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-tooltip-${tooltipId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the color or semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) color?:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>;
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
      if (newValue) {
        document.body.addEventListener('click', this.handleBodyClick);
        document.body.addEventListener('keydown', this.handleBodyKeyDown);
        document.body.addEventListener('mousemove', this.handleMouseMove);
        setTimeout(() => {
          if (this.contentWrapper && this.focusContentOnOpen) {
            focusFirstFocusableElement(this.contentWrapper);
          }
        }, 2);
      } else {
        document.body.removeEventListener('click', this.handleBodyClick);
        document.body.removeEventListener('keydown', this.handleBodyKeyDown);
        document.body.removeEventListener('mousemove', this.handleMouseMove);
      }
      if (this.isControlled && newValue !== oldValue) {
        if (newValue) {
          this.openOrUpdateTooltip();
        } else {
          this.closeTooltip();
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
   * @order 1
   */
  @Prop() placement: Placement = 'top';
  /**
   * Determines the interaction that triggers the component.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() interaction: 'hover' | 'click' = 'hover';
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
  @Prop() flip?: boolean;
  /**
   * Determines if the component should shift if it goes off screen.
   * @category Appearance
   */
  @Prop() shift?: 'overlap' | true;
  /**
   * Determines whether the component traps focus.
   * @category Behavior
   */
  @Prop() trapFocus?: boolean = false;
  /**
   * Determines whether the component focuses the target when it closes.
   * @category Behavior
   */
  @Prop() focusTargetOnClose?: boolean = false;
  /**
   * Determines whether the component focuses the content when it opens.
   * @category Behavior
   */
  @Prop() focusContentOnOpen?: boolean = false;
  /**
   * Defines a classname to be applied to the content.
   * @category Behavior
   */
  @Prop() contentClassname?: string;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;
  /**
   * Determines if the component allows content selection.
   * @category Behavior
   */
  @Prop() allowContentSelection: boolean = false;
  /**
   * Event that emits when the tooltip opens.
   */
  @Event({ cancelable: true }) open!: EventEmitter<void>;
  /**
   * Event that emits when the tooltip closes.
   */
  @Event({ cancelable: true }) close!: EventEmitter<void>;
  /**
   * A method to open the tooltip.
   */
  @Method()
  async openElement(anchor?: globalThis.Element | TooltipTargetBox): Promise<void> {
    if (this.target && anchor) {
      return;
    }
    if (this.disabled || this.isOpen) {
      return;
    }
    if (anchor) {
      const createVirtualElement = (a: TooltipTargetBox) => {
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
      this.openOrUpdateTooltip();
    } else {
      this.setStackIndex();

      if (!this.isOpen) {
        this.openOrUpdateTooltip();
      }
    }
  }
  /**
   * A method to close the tooltip.
   */
  @Method()
  async closeElement(): Promise<void> {
    this.closeTooltip();
  }

  private internalGetBoundingClientRect() {
    return this.contentWrapper?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    window.addEventListener('popstate', this.cleanupPopstate);
    this.isControlled = this.isOpen !== undefined;
    if (this.isControlled && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This tooltip is in controlled mode.`, this.elm);
    }
    this.updateTargetReference();
  }

  componentDidLoad() {
    if (this.isControlled && this.isOpen) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      this.setStackIndex();
      this.openOrUpdateTooltip();
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

  // A function that tracks the order in which the tooltips have opened to determine the closing order
  private setStackIndex = () => {
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement.length > 0 ? Array.from(stackIndexElement) : undefined;
    const indexes = elements
      ? elements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [-1];
    const maxIndex = Math.max(...indexes);

    if (this.contentWrapper) {
      this.elm.dataset.stackIndex = (maxIndex + 1).toString();
    }
  };

  // A function that resets the tooltip's stack index
  private resetStackIndex = () => {
    if (this.contentWrapper) {
      delete this.elm.dataset.stackIndex;
    }
  };

  // Determines the position of the arrow relative to the tooltip
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

  // Calculates the position of the tooltip relative to the target and other set constraints
  private calculateTooltipPosition = () => {
    if (this.target instanceof globalThis.Element && this.contentWrapper && this.isOpen) {
      const middlewareToApply = [
        ...(this.flip ? [flip()] : []),
        ...(this.placement ? [] : [autoPlacement()]),
        ...(this.shift
          ? [shift({ crossAxis: this.shift === 'overlap', limiter: limitShift() })]
          : []),
        hide(),
        ...((this.arrow && [
          arrow({ element: this.arrow }),
          offset({
            mainAxis: TOOLTIP_ARROW_SIZE + (this.offset ? this.offset[0] : 0),
            crossAxis: 0 + (this.offset ? this.offset[1] : 0),
          }),
        ]) ||
          (this.offset && [offset({ mainAxis: this.offset[0], crossAxis: this.offset[1] })]) ||
          []),
      ];
      computePosition(this.target, this.contentWrapper, {
        placement: this.placement,
        strategy: this.strategy,
        middleware: [...middlewareToApply],
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
    if (this.target && this.contentWrapper) {
      autoUpdate(this.target, this.contentWrapper, () => this.calculateTooltipPosition());
    }
  };

  // Handles moving the tooltip content to the root or another specified portal destination
  private openOrUpdateTooltip = () => {
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
        }
      }
      if (this.isControlled) {
        this.open.emit();
      }
    }
  };

  // Moves the tooltip content back to the original tooltip root
  private closeTooltip = () => {
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
            this.target.focus();
          }
        }
      }
    }
    if (this.isControlled) {
      this.close.emit();
      this.hasOpened = false;
      this.updateTargetReference();
      if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
        this.target.focus();
      }
    }

    const exists = document.getElementById(`virtual-${this.internalId}`);
    exists?.remove();
  };

  // When the target is clicked update the stack index and open or close the tooltip
  private handleTargetClick = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdateTooltip();
    } else {
      this.closeTooltip();
    }
  };

  // When the target is hovered update the stack index and open the tooltip
  private handleTargetHover = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdateTooltip();
    }
  };

  // Determines if the tooltip should be closed after a certain interaction
  private maybeCloseTooltip = (
    e: globalThis.KeyboardEvent | globalThis.MouseEvent,
    skipContainedFork?: boolean,
  ) => {
    const target = e.target;
    const currentTarget = e.currentTarget;
    const path = e.composedPath();
    const pathTarget = path.filter((n) => (n as globalThis.Element).slot === 'target');
    const isContained =
      (target && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (currentTarget && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (!isEmpty(pathTarget) && this.elm.contains(pathTarget[0] as globalThis.Element));

    if (isContained && !skipContainedFork) {
      return;
    }

    if (
      !isEmpty(pathTarget) &&
      !this.elm.contains(pathTarget[0] as globalThis.Element) &&
      !isContained
    ) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      return this.closeTooltip();
    }

    // Include tooltip shadow root elements
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement;
    const indexes = elements.map((e) => Number((e as HTMLElement).dataset.stackIndex));
    const maxIndex = Math.max(...indexes);

    if (maxIndex.toString() === this.elm.dataset.stackIndex) {
      this.closeTooltip();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  // Check if the tooltip should be closed when ESC is pressed
  private handleBodyKeyDown = (e: globalThis.KeyboardEvent) => {
    if (this.shouldCloseOnESCKey) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.maybeCloseTooltip(e, true);
      }
    }
  };

  // Check if the tooltip should be closed when the body of the document is clicked
  private handleBodyClick = (e: globalThis.MouseEvent) => {
    if (
      this.shouldCloseOnClickOutside &&
      !this.elm.contains(e.target as globalThis.Element) &&
      this.target !== e.target
    ) {
      this.maybeCloseTooltip(e);
    }
  };

  private disableHover = () => {
    this.closeTooltip();
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

      const timeout = this.allowContentSelection ? 15 : 2;
      this.hoverTimer = undefined;
      this.hoverTimer = window.setTimeout(() => this.disableHover(), timeout);
    }
  };

  // Cleans up and closes the tooltip when the popstate event fires
  private cleanupPopstate() {
    this.isControlled = false;
    this.isOpen = undefined;
    this.closeTooltip();
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
    const contents = this.elm.querySelector('br-tooltip-content');
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
  private renderTooltipArrow = () => {
    const proportionRatio = 0.7079166667;
    return (
      <div
        ref={(ref) => (this.arrow = ref)}
        id="arrow"
        style={{
          display: 'inline-flex',
          position: 'absolute',
          width: `${TOOLTIP_ARROW_SIZE}px`,
          height: `${TOOLTIP_ARROW_SIZE}px`,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'space-around',
          pointerEvents: 'none',
          zIndex: `calc(var(--z-index-popover) + 1)`,
        }}
      >
        <div
          style={{
            height: `${TOOLTIP_ARROW_SIZE * proportionRatio}px`,
            width: `${TOOLTIP_ARROW_SIZE * proportionRatio}px`,
            transform: `translateY(-${TOOLTIP_ARROW_SIZE / 2 + 1}px)`,
          }}
        >
          <div
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent)',
              height: `${TOOLTIP_ARROW_SIZE * proportionRatio}px`,
              width: `${TOOLTIP_ARROW_SIZE * proportionRatio}px`,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    const hasStyleDefiningProp = this.color;
    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.color && !ColorsWithNoShades.includes(this.color);
    const appliedShadeName = shadeNames.find((shade) => this.color?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.color ? this.color.replace(`-${appliedShadeName}`, '') : this.color;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    const backgroundColor = `var(--color-${colorName}${shadeName})`;
    return (
      <Host>
        <div
          data-parent-tooltip-id={this.internalId}
          data-placement={this.placement}
          ref={(ref) => (this.contentWrapper = ref)}
          class={{
            [`br-tooltip-content-wrapper-${this.internalId}`]: true,
            'br-tooltip-content-wrapper-open': this.isOpen === true,
            'br-tooltip-content-wrapper': true,
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
            visibility: 'hidden',
            top: `0px`,
            left: `0px`,
            zIndex: 'var(--z-index-popover)',
          }}
        >
          {hasStyleDefiningProp && (
            <style>
              {this.color &&
                `
                  .br-tooltip-content-wrapper-${this.internalId} {
                    --color-tooltip-background: ${backgroundColor};
                  }
                  .br-tooltip-content-wrapper-${this.internalId} br-tooltip-content[theme] {
                    --color-tooltip-background: ${backgroundColor};
                  }
                  :host { 
                    --color-tooltip-background: ${backgroundColor};
                  }`}
            </style>
          )}
          <slot></slot>
          <svg
            width="100%"
            height="100%"
            style={{
              zIndex: '0',
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
          {this.showArrow === true && this.renderTooltipArrow()}
        </div>
        <div class="br-tooltip-target-wrapper">
          <slot onSlotchange={() => this.updateTargetReference()} name="target"></slot>
        </div>
      </Host>
    );
  }
}

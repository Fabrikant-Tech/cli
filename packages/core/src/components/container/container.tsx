import {
  Component,
  h,
  Host,
  Prop,
  ComponentInterface,
  Element,
  State,
  Listen,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';
import { Theme, ColorType } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseBorderModel,
  BaseBoxCornerSizeModel,
  BaseBoxEdgeSizeModel,
  BaseBoxShadowModel,
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseElevation,
  BaseFilters,
  BaseFlexboxAlignItems,
  BaseFlexboxDirection,
  BaseFlexboxJustifyContent,
  BaseGradientModel,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseOpacityModel,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
  BaseThreeAxisRotation,
} from '../../reserved/editor-types';
import {
  getBorderModelValue,
  getBoxShadowValue,
  getColorFromObject,
  getCornerModelValue,
  getEdgeModelValue,
  getFilterValue,
  getGradientValue,
  getPropertyValue,
  getRotationValue,
  getTransitionValue,
} from './utils/utils';
import { ColorName, ColorShadeName } from '../../global/types/roll-ups';

// This id increments for all containers on the page
let containerId = 0;

/**
 * The container component is used to create atomic layout constructs.
 * @category Layout
 * @slot - Passes the content to the container.
 */
@Component({
  tag: 'br-container',
  styleUrl: './css/container.css',
  shadow: true,
})
export class Container implements ComponentInterface {
  /**
   * A timeout that tracks when a typeahead value change happens.
   */
  private resizeTimeout: ReturnType<typeof setTimeout>;
  /**
   * A resize observer to watch for resize events.
   */
  private resizeObserver: ResizeObserver | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrContainerElement;
  /**
   * Whether the resize event has started.
   */
  @State() resizedStarted: boolean = false;
  /**
   * Stores if the component has rendered once.
   */
  @State() hasRendered: boolean;
  /**
   * Stores if the container was focused via mouse.
   */
  @State() focusedViaMouse: boolean | undefined;
  /**
   * Stores if the container is focused.
   */
  @State() isFocused: boolean;
  /**
   * Stores the active state of the container.
   */
  @State() activeState: 'hover' | 'focus' | 'focus-visible' | 'active' | 'disabled' | undefined;
  @Watch('activeState')
  activeStateChanged() {
    this.hasRendered = true;
  }
  /**
   * Which state to display.
   */
  @Prop() state?: 'hover' | 'focus' | 'focus-visible' | 'active' | 'disabled' | undefined;
  @Watch('state')
  stateChanged() {
    this.hasRendered = true;
  }
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-container-${containerId++}`;
  /**
   * Determines if resizes of the component are monitored.
   * @category Behavior
   */
  @Prop() monitorResize?: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * The min width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) minWidth?: BaseSize<BaseSizes>;
  /**
   * The min height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) minHeight?: BaseSize<BaseSizes>;
  /**
   * The max width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) maxWidth?: BaseSize<BaseSizes>;
  /**
   * The max height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) maxHeight?: BaseSize<BaseSizes>;
  /**
   * Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() shrink?: boolean = false;
  /**
   * Defines the background color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() backgroundColor: BaseColorObjectType<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * Defines the background gradient applied to the component.
   * @category Appearance
   * @order 2
   */
  @Prop() backgroundGradient?: BaseGradientModel<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * Defines the color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop() textColor: BaseColorObjectType<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * A box model value for the padding. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop() padding?: BaseBoxEdgeSizeModel;
  /**
   * A box model value for the margin. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop() margin?: BaseBoxEdgeSizeModel;
  /**
   * A box model value for the border radius. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 1
   */
  @Prop() borderRadius?: BaseBoxCornerSizeModel;
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() direction: BaseFlexboxDirection = 'column';
  /**
   * Determines the component's direction alignment.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() directionAlignment: BaseFlexboxAlignItems | BaseFlexboxJustifyContent = 'start';
  /**
   * Determines the component's secondary alignment.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop() secondaryAlignment: BaseFlexboxAlignItems = 'start';
  /**
   * Determines the overflow of the component.
   * @category Appearance
   */
  @Prop() overflow?: 'hidden' | 'visible' | 'auto';
  /**
   * Determines the type of scrolling allowed.
   * @category Appearance
   */
  @Prop() allowedScroll: 'horizontal' | 'vertical' | 'any' | false = false;
  /**
   * Determines whether the component allows the content to wrap.
   * @category Appearance
   */
  @Prop() wrap?: true | undefined | 'reverse';
  /**
   * A tuple box model value for the vertical gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 2
   */
  @Prop() verticalGap?: BaseSize<BaseSizes> | undefined;
  /**
   * A tuple box model value for the horizontal gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 2
   */
  @Prop() horizontalGap?: BaseSize<BaseSizes> | undefined;
  /**
   * Defines the opacity of the component.
   * @category Appearance
   */
  @Prop() opacity?: BaseOpacityModel;
  /**
   * Defines the perspective distance of the component.
   * @category Appearance
   */
  @Prop() perspective?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * Defines the rotation of the component.
   * @category Appearance
   */
  @Prop() rotation?: BaseThreeAxisRotation;
  /**
   * A box model value for the border of the component.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop() border?: BaseBorderModel<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * Defines the elevation shadow displayed on the component.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop() elevation?:
    | BaseElevation
    | BaseBoxShadowModel<
        | BaseColorNameType<ColorName>
        | BaseColorType<ColorType>
        | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
        | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
      >;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines whether the component should be focusable.
   * @category Behavior
   */
  @Prop() focusable?: boolean;
  /**
   * Defines the graphical filter applied to the component.
   * @category Appearance
   */
  @Prop() filter?: BaseFilters<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >[];
  /**
   * Defines the transition duration of the component.
   * @category Behavior
   */
  @Prop() transitionDuration?: `${number}ms` | `${number}s`;
  /**
   * Determines which css properties are transitioned.
   * @category Behavior
   */
  @Prop() transitionProperty?: Array<keyof CSSStyleDeclaration>;
  /**
   * Defines the transition easing of the component.
   * @category Behavior
   */
  @Prop() transitionEasing?:
    | 'ease-in'
    | 'linear'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | string;
  /**
   * Defines the font family used in the component.
   * @category Appearance
   */
  @Prop() fontFamily?: 'body' | 'headings' | 'code';
  /**
   * Defines the font size used in the component.
   * @category Appearance
   */
  @Prop() fontSize?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * Defines the line height used in the component.
   * @category Appearance
   */
  @Prop() lineHeight?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * Defines the z-index used in the component.
   * @category Appearance
   */
  @Prop() zIndex?: number;
  /**
   * Defines the debounce time for the resize event.
   * @category Behavior
   */
  @Prop() resizeDebounceTime: number = 200;
  /**
   * Emits when the element is resized.
   */
  @Event() resized: EventEmitter<void>;
  /**
   * Emits when the element resize starts.
   */
  @Event() resizeStarted: EventEmitter<void>;
  /**
   * Emits when the element resize stops.
   */
  @Event() resizeStopped: EventEmitter<void>;
  /**
   * Event that triggers when scroll happens.
   */
  @Event() scroll: EventEmitter<{ left: number; top: number }>;
  /**
   * Event that triggers when scroll starts.
   */
  @Event() scrollStart: EventEmitter<{ left: number; top: number }>;
  /**
   * Event that triggers when scroll stops.
   */
  @Event() scrollStop: EventEmitter<{ left: number; top: number }>;

  componentWillLoad(): Promise<void> | void {
    if (this.monitorResize) {
      this.resizeObserver = new ResizeObserver(this.emitResizeEvent);
    }
  }

  componentDidLoad(): void {
    if (this.monitorResize && this.resizeObserver) {
      this.resizeObserver.observe(this.elm);
    }
  }

  private resetResizeStopped = () => {
    this.resizedStarted = false;
    this.resizeStopped.emit();
  };

  private emitResizeEvent = () => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(this.resetResizeStopped, this.resizeDebounceTime);
    if (!this.resizedStarted) {
      this.resizedStarted = true;
      this.resizeStarted.emit();
    }
    this.resized.emit();
  };

  private setFocus = () => {
    const hasFocusedState =
      this.elm.querySelector(':scope > br-container-state[state="focus"]') ||
      this.elm.querySelector(':scope > br-container-state[state="focus-visible"]');

    if (
      (hasFocusedState && !this.disabled) ||
      (hasFocusedState && !this.disabled && !this.focusedViaMouse)
    ) {
      if (!this.disabled && this.elm.querySelector(':scope > br-container-state[state="focus"]')) {
        this.activeState = 'focus';
      }
      if (
        !this.disabled &&
        !this.focusedViaMouse &&
        this.elm.querySelector(':scope > br-container-state[state="focus-visible"]')
      ) {
        this.activeState = 'focus-visible';
      }
    }
  };

  private setHover = () => {
    const hasHoverState = this.elm.querySelector(':scope > br-container-state[state="hover"]');
    if (hasHoverState && !this.disabled) {
      this.activeState = 'hover';
    }
  };

  private setActive = () => {
    const hasActiveState = this.elm.querySelector(':scope > br-container-state[state="active"]');
    if (hasActiveState && !this.disabled) {
      this.activeState = 'active';
      const hasFocusedState = this.elm.querySelector(':scope > br-container-state[state="focus"]');
      if (hasFocusedState) {
        this.focusedViaMouse = true;
      }
    }
  };

  @Listen('focus')
  resolveInternalFocus(e: Event) {
    if (e.target === this.elm && e.target === e.currentTarget) {
      this.isFocused = true;
      this.setFocus();
    }
  }

  @Listen('blur')
  resolveInternalBlur(e: Event) {
    if (e.target === this.elm) {
      this.focusedViaMouse = undefined;
      this.isFocused = false;
      this.activeState = undefined;
    }
  }

  @Listen('mouseup')
  resolveMouseUp() {
    this.focusedViaMouse = true;
    const hasFocusedState = this.elm.querySelector(':scope > br-container-state[state="focus"]');
    if (hasFocusedState) {
      this.isFocused = true;
    }
    setTimeout(() => {
      this.elm.focus();
      this.setHover();
    }, 0);
  }

  @Listen('mousedown')
  resolveInternalClick(e: MouseEvent) {
    this.focusedViaMouse = true;
    if (e.currentTarget === this.elm) {
      setTimeout(() => {
        this.setActive();
      }, 0);
    }
  }

  @Listen('mouseup')
  resolveInternalClickUp(e: MouseEvent) {
    if (e.target === this.elm) {
      const hasHoverState = this.elm.querySelector(':scope > br-container-state[state="hover"]');
      if (hasHoverState) {
        this.setHover();
      } else {
        this.activeState = undefined;
      }
    }
  }

  @Listen('mouseover')
  resolveInternalHover(e: MouseEvent) {
    if (e.target === this.elm) {
      this.setHover();
    }
  }

  @Listen('mouseleave')
  resolveInternalLeave(e: MouseEvent) {
    if (e.target === this.elm) {
      this.activeState = undefined;
      const hasFocusedState =
        this.elm.querySelector(':scope > br-container-state[state="focus"]') ||
        this.elm.querySelector(':scope > br-container-state[state="focus-visible"]');
      if (
        (this.isFocused && hasFocusedState) ||
        (this.isFocused && hasFocusedState && !this.focusedViaMouse)
      ) {
        this.setFocus();
      }
    }
  }

  @Listen('keydown')
  resolveInternalKeyDown(e: KeyboardEvent) {
    if (e.target === this.elm) {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.setActive();
      }
    }
  }

  @Listen('keyup')
  resolveInternalKeyUp(e: KeyboardEvent) {
    const key = e.key;
    if (e.target === this.elm) {
      setTimeout(() => {
        if (key !== 'Tab') {
          setTimeout(() => {
            this.setFocus();
          }, 0);
        }
      }, 0);
    }
  }

  componentDidRender(): void {
    this.hasRendered = true;
  }

  private handleScroll = (e: CustomEvent<{ left: number; top: number }> | Event) => {
    const isCustomEvent = e instanceof CustomEvent;
    if (!isCustomEvent) {
      return;
    }
    this.scroll.emit(e.detail);
  };

  render() {
    const stateObject = Array.from(this.elm.querySelectorAll(':scope > br-container-state')).filter(
      (s: HTMLBrContainerStateElement) =>
        this.disabled
          ? s.state === 'disabled'
          : s.state === this.state || s.state === this.activeState,
    );
    const propertySource =
      stateObject.length > 0 ? (stateObject[0] as HTMLBrContainerElement) : this;

    const direction = getPropertyValue('direction', propertySource, this);
    const directionAlignment = getPropertyValue('directionAlignment', propertySource, this);
    const secondaryAlignment = getPropertyValue('secondaryAlignment', propertySource, this);
    const wrap = getPropertyValue('wrap', propertySource, this);
    const padding = getPropertyValue('padding', propertySource, this);
    const perspective = getPropertyValue('perspective', propertySource, this);
    const verticalGap = getPropertyValue('verticalGap', propertySource, this);
    const horizontalGap = getPropertyValue('horizontalGap', propertySource, this);
    const textColor = getPropertyValue('textColor', propertySource, this);
    const borderRadius = getPropertyValue('borderRadius', propertySource, this);
    const backgroundColor = getPropertyValue('backgroundColor', propertySource, this);
    const backgroundImage = getPropertyValue('backgroundGradient', propertySource, this);
    const margin = getPropertyValue('margin', propertySource, this);
    const rotation = getPropertyValue('rotation', propertySource, this);
    const width = getPropertyValue('width', propertySource, this);
    const height = getPropertyValue('height', propertySource, this);
    const minHeight = getPropertyValue('minHeight', propertySource, this);
    const minWidth = getPropertyValue('minWidth', propertySource, this);
    const maxHeight = getPropertyValue('maxHeight', propertySource, this);
    const maxWidth = getPropertyValue('maxWidth', propertySource, this);
    const opacity = getPropertyValue('opacity', propertySource, this);
    const shrink = getPropertyValue('shrink', propertySource, this);
    const overflow = getPropertyValue('overflow', propertySource, this);
    const border = getPropertyValue('border', propertySource, this);
    const filter = getPropertyValue('filter', propertySource, this);
    const elevation = getPropertyValue('elevation', propertySource, this);
    const allowedScroll = getPropertyValue('allowedScroll', propertySource, this);
    const transition = this.hasRendered
      ? getTransitionValue(
          getPropertyValue('transitionDuration', propertySource, this),
          getPropertyValue('transitionProperty', propertySource, this),
          getPropertyValue('transitionEasing', propertySource, this),
        )
      : undefined;
    const fontSize = getPropertyValue('fontSize', propertySource, this);
    const lineHeight = getPropertyValue('lineHeight', propertySource, this);
    const fontFamily = getPropertyValue('fontFamily', propertySource, this);
    const zIndex = getPropertyValue('zIndex', propertySource, this);

    const layoutStyling = {
      flexDirection: direction,
      alignItems: secondaryAlignment,
      justifyContent: directionAlignment,
    };

    const renderContentSlot = () => {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            flexWrap: wrap ? 'wrap' : wrap,
            padding: getEdgeModelValue(padding),
            perspective: perspective,
            transformStyle: perspective ? 'preserve-3d' : undefined,
            gap:
              verticalGap || horizontalGap
                ? `${verticalGap || '0px'} ${horizontalGap || '0px'}`
                : undefined,
            transition: transition ? transition : 'none',
            ...layoutStyling,
          }}
        >
          <slot></slot>
        </div>
      );
    };

    const elevationShadow =
      elevation !== undefined && !Array.isArray(elevation)
        ? `var(--elevation-shadow-${elevation})`
        : undefined;
    const boxShadow =
      elevation !== undefined && Array.isArray(elevation)
        ? getBoxShadowValue(elevation)
        : elevationShadow;

    return (
      <Host tabIndex={!this.disabled && this.focusable ? 0 : undefined}>
        <style>{`:host { 
          --container-font-size: ${fontSize};
          --container-line-height: ${lineHeight};
          --container-font-family: var(--typography-${fontFamily});
          --container-text-color: ${getColorFromObject(textColor)};
          --container-border-radius: ${getCornerModelValue(borderRadius)};
          --container-border: ${getBorderModelValue(border)};
          --container-background-color: ${getColorFromObject(backgroundColor)};
          --container-background-image: ${getGradientValue(backgroundImage)};
          --container-margin: ${getEdgeModelValue(margin)};
          --container-transform: ${this.elm.style.transform?.replace(/(rotateX\().*(deg\))/g, '')} ${getRotationValue(rotation)};
          --container-width: ${width};
          --container-height: ${height};
          --container-min-height: ${minHeight};
          --container-min-width: ${minWidth};
          --container-max-height: ${maxHeight};
          --container-max-width: ${maxWidth};
          --container-opacity: ${opacity ? opacity : 'unset'};
          --container-flex-shrink: ${shrink ? 1 : 0};
          --container-overflow: ${overflow || (allowedScroll !== false ? 'hidden' : undefined)};
          --container-filter: ${getFilterValue(filter)};
          --container-box-shadow: ${boxShadow};
          --container-transition: ${transition ? transition : 'none'};
          --container-z-index: ${zIndex};
        }`}</style>
        {allowedScroll !== false ? (
          <br-scroll-area
            style={{ width: '100%', height: '100%' }}
            allowedScroll={allowedScroll}
            onScroll={this.handleScroll}
            onScrollStart={(e) => this.scrollStart.emit(e.detail)}
            onScrollStop={(e) => this.scrollStop.emit(e.detail)}
          >
            {renderContentSlot()}
          </br-scroll-area>
        ) : (
          renderContentSlot()
        )}
      </Host>
    );
  }
}

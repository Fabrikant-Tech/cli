import { Component, Prop, ComponentInterface } from '@stencil/core';
import { Theme, ColorType } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
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
} from '../../../reserved/editor-types';
import { ColorName, ColorShadeName } from '../../../global/types/roll-ups';

/**
 * The container component is used to create atomic layout constructs.
 * @category Layout
 * @slot - Passes the content to the container.
 * @slot highlight - Passes a highlight element to the container that follows the mouse on the container.
 */
@Component({
  tag: 'br-container-state',
})
export class ContainerState implements ComponentInterface {
  /**
   * Defines the state to be displayed.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) state: 'hover' | 'focus' | 'focus-visible' | 'active' | 'disabled' =
    'hover';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * The min width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) minWidth?: BaseSize<BaseSizes>;
  /**
   * The min height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) minHeight?: BaseSize<BaseSizes>;
  /**
   * The max width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) maxWidth?: BaseSize<BaseSizes>;
  /**
   * The max height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) maxHeight?: BaseSize<BaseSizes>;
  /**
   * Defines the background color applied to the component.
   * @category Appearance
   * @visibility persistent
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
   * @visibility persistent
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
   */
  @Prop() padding?: BaseBoxEdgeSizeModel;
  /**
   * A box model value for the margin. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   */
  @Prop() margin?: BaseBoxEdgeSizeModel;
  /**
   * A box model value for the border radius. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   */
  @Prop() borderRadius?: BaseBoxCornerSizeModel;
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   */
  @Prop() direction: BaseFlexboxDirection = 'column';
  /**
   * Determines the component's direction alignment.
   * @category Appearance
   */
  @Prop() directionAlignment: BaseFlexboxAlignItems | BaseFlexboxJustifyContent = 'start';
  /**
   * Determines the component's secondary alignment.
   * @category Appearance
   */
  @Prop() secondaryAlignment: BaseFlexboxAlignItems | BaseFlexboxJustifyContent = 'start';
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
   * Determines whether the component shrinks when it's dimensions are larger than the available dimensions in the parent.
   * @category Appearance
   */
  @Prop() shrink?: boolean;
  /**
   * A tuple box model value for the vertical gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop() verticalGap?: BaseSize<BaseSizes> | undefined;
  /**
   * A tuple box model value for the horizontal gap. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop() horizontalGap?: BaseSize<BaseSizes> | undefined;
  /**
   * Defines the opacity of the component.
   * @category Appearance
   */
  @Prop() opacity?: BaseOpacityModel;
  /**
   * The perspective applied to the container.
   */
  @Prop() perspective?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * The rotation applied to the container.
   */
  @Prop() rotation?: BaseThreeAxisRotation;
  /**
   * A box model value for the border of the component.
   * @category Appearance
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
   * @visibility persistent
   */
  @Prop() fontFamily?: 'body' | 'headings' | 'code';
  /**
   * Defines the font size used in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() fontSize?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * Defines the line height used in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() lineHeight?: BaseSize<BaseSizes, `${number}%`>;
  /**
   * Defines the z-index used in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() zIndex?: number;
}

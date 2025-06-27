import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';
import {
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  ColorName,
  getAllUniqueShadeNames,
  isCSSColor,
} from '../../global/types/roll-ups';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { SEPARATOR_DEFAULT_PROPS } from './types/separator-types';
import { toKebabCase } from '../container/utils/utils';
import {
  BaseSize,
  BaseSizes,
  BaseColorType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorNameShadeType,
  BaseHexColor,
  BaseRgbColor,
  BaseRgbaColor,
  BaseHSLColor,
  BaseHSLAColor,
  BaseOpacityModel,
} from '../../reserved/editor-types';
/**
 * The Separator component is a line that can be used to separate different parts of an element or screen.
 * @category Layout
 */
@Component({
  tag: 'br-separator',
  styleUrl: './css/separator.css',
  shadow: true,
})
export class Separator implements ComponentInterface {
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
   * @order 1
   */
  @Prop({ reflect: true }) color?:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined = 'Neutral';
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = SEPARATOR_DEFAULT_PROPS.size;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes> = SEPARATOR_DEFAULT_PROPS.size;
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
   * Defines the opacity of the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop() opacity: BaseOpacityModel;
  /**
   * Defines the margin of the component.
   * @category Dimensions
   * @visibility persistent
   * @order 2
   */
  @Prop() margin: Partial<{
    top: BaseSize<BaseSizes>;
    right: BaseSize<BaseSizes>;
    left: BaseSize<BaseSizes>;
    bottom: BaseSize<BaseSizes>;
  }>;

  render() {
    const shadeNames = getAllUniqueShadeNames();
    const colorToUse = this.color || SEPARATOR_DEFAULT_PROPS.color[this.theme];
    const mightHaveShadeName = colorToUse && !ColorsWithNoShades.includes(colorToUse);
    const appliedShadeName = shadeNames.find((shade) => colorToUse?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && colorToUse ? colorToUse.replace(`-${appliedShadeName}`, '') : colorToUse;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    const colorOrType =
      colorToUse && isCSSColor(colorToUse)
        ? colorToUse
        : `var(--color-${colorName}${shadeName || ''})`;

    return (
      <Host>
        <style>
          {`:host {
              --separator-margin: ${this.margin?.top || 0} ${this.margin?.right || 0} ${this.margin?.bottom || 0} ${this.margin?.left || 0};
              --separator-width: ${this.width};
              --separator-height: ${this.height};
              --separator-color: ${colorOrType};
              --separator-opacity: ${this.opacity || SEPARATOR_DEFAULT_PROPS.opacity[this.theme]};
            }`}
        </style>
      </Host>
    );
  }
}

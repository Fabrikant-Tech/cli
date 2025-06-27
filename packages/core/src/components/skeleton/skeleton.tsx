import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import {
  ColorName,
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  getAllUniqueShadeNames,
} from '../../global/types/roll-ups';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseSize,
  BaseSizes,
  BaseColorType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorNameShadeType,
} from '../../reserved/editor-types';
import { SkeletonSize, SKELETON_DEFAULT_PROPS } from './types/skeleton-types';
import { toKebabCase } from '../container/utils/utils';

/**
 * The Skeleton component displays a visual placeholder for content that is about to be loaded.
 * @category Display
 */
@Component({
  tag: 'br-skeleton',
  styleUrl: 'css/skeleton.css',
  shadow: true,
})
export class Skeleton implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSkeletonElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: SkeletonSize = SKELETON_DEFAULT_PROPS.size;
  /**
   * Defines the color or semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop() color:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`> = 'Neutral';
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
   * Defines the border radius of the component.
   * @category Appearance
   * @order 1
   */
  @Prop({ reflect: true }) borderRadius?: BaseSize<BaseSizes>;
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
   * Defines animation type.
   * @category Animation
   * @visibility persistent
   */
  @Prop({ reflect: true }) animation?: 'Wave' | 'Blink' = 'Wave';

  render() {
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
      <Host
        style={{
          width: this.width,
          height: this.height,
          borderRadius: this.borderRadius,
        }}
      >
        <style>{`:host { --skeleton-background-color: ${backgroundColor};`}</style>
      </Host>
    );
  }
}

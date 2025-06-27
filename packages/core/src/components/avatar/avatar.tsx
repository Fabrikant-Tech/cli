import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import {
  ColorsWithNoShades,
  getAllUniqueColorsValues,
  ColorName,
  ColorShadeName,
  ColorShadeNameDefault,
  getAllUniqueShadeNames,
  isCSSColor,
} from '../../global/types/roll-ups';
import chroma from 'chroma-js';
import { toKebabCase } from '../container/utils/utils';
import { ColorType, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../reserved/editor-types';

const textColorStrategy: 'contrast' | 'flat' = 'flat';
/**
 * The Avatar component displays a unique visual identifier for each user. The `content` prop can be used to pass a username, or an image URL.
 *
 * If an image URL is passed to the `content` prop, the image identifies the user. If an image is not passed, the component generates a unique background image using the other props, including `hashString`.
 * @category Display
 * @slot - Passes alternative content to the avatar.
 * @slot background - Passes background elements to the avatar.
 */
@Component({
  tag: 'br-avatar',
  styleUrl: 'css/avatar.css',
  shadow: true,
})
export class Avatar implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrAvatarElement;
  /**
   * The avatar content as a first last name, url or single string.
   * @category Data
   * @visibility persistent
   */
  @Prop() content?: `${string} ${string}` | `url(${string})`;
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
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the color or semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop() color?:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined = undefined;
  /**
   * The string that is used to define the hash that the color is calculated based on.
   * @category Data
   */
  @Prop() hashString?: string;
  /**
   * Defines an alternate set of colors to be used in the avatar palette.
   * @category Appearance
   */
  @Prop() alternateColors?: `#${string}`[];

  private getPseudoHash = (firstname: string, lastName: string = '') => {
    const fullName = firstname + lastName;
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = (hash * 31 + fullName.charCodeAt(i)) % 100000;
    }
    const uniqueValue = (hash % 10000) / 100;
    return uniqueValue;
  };

  private generateBackgroundColorBasedOnContent = () => {
    const hash = this.getPseudoHash(this.hashString || this.content || '');
    // Exclude colors that should not be used in the avatar palette
    const colorsToUse =
      this.alternateColors ||
      getAllUniqueColorsValues(
        [
          'Black',
          'White',
          'Background',
          'PopoverBackground',
          'PopoverColor',
          'TooltipBackground',
          'TooltipColor',
          'DefaultText',
        ],
        'all',
      );
    const sortBySaturation = colorsToUse.sort(
      (a, b) => chroma.hex(a).hsl()[1] - chroma.hex(b).hsl()[1],
    );
    const colorScale = chroma.scale(sortBySaturation);
    return colorScale.domain([0, 100])(hash).hex();
  };

  private getColorBasedOnContrast = (color: string) => {
    const backgroundColor = color.includes('var(')
      ? getComputedStyle(document.documentElement).getPropertyValue(
          color.replace('var(', '').replace(')', ''),
        )
      : color;
    const contrast = chroma.contrast(backgroundColor, 'white');
    let baseColor: string;
    if (contrast > 3.5) {
      baseColor = 'white';
    } else {
      baseColor = 'black';
    }
    if (textColorStrategy === 'contrast') {
      if (baseColor === 'white') {
        return chroma(backgroundColor).brighten(3).hex();
      } else {
        return chroma(backgroundColor).darken(3).hex();
      }
    } else {
      return baseColor;
    }
  };

  render() {
    const isImage = this.content?.startsWith('url(');
    const string =
      (this.content || '').split(' ').length > 1
        ? (this.content || '')[0] + (this.content || '').split(' ')[1][0]
        : this.content;

    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.color && !ColorsWithNoShades.includes(this.color);
    const appliedShadeName = shadeNames.find((shade) => this.color?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.color ? this.color.replace(`-${appliedShadeName}`, '') : this.color;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    const colorOrType =
      this.color && isCSSColor(this.color)
        ? this.color
        : `var(--color-${colorName}${shadeName || ''})`;

    const backgroundColor = !this.color
      ? this.generateBackgroundColorBasedOnContent()
      : colorOrType;
    return (
      <Host
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <style>{`:host { --avatar-color: ${this.getColorBasedOnContrast(backgroundColor)} }`}</style>
        <div
          class="br-avatar-content"
          style={{
            backgroundImage: isImage ? this.content : 'none',
          }}
        >
          <slot>{!isImage && <span>{string}</span>}</slot>
        </div>
        <slot name="background"></slot>
      </Host>
    );
  }
}

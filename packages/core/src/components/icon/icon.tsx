import { Component, Host, Prop, h } from '@stencil/core';
import {
  ColorName,
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  getAllUniqueShadeNames,
} from '../../global/types/roll-ups';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { renderAsset } from './generated/utils/render-asset';
import { IconName } from './generated/types/asset-types';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
  BaseSize,
  BaseSizes,
} from '../../reserved/editor-types';
import { toKebabCase } from '../container/utils/utils';

// This id increments for all buttons on the page
let iconId = 0;

/**
 * Icon components are visual indicators that symbolize an action that a user can take or a thematic concept.
 * @category Display
 */
@Component({
  tag: 'br-icon',
  styleUrl: './css/icon.css',
  shadow: true,
})
export class Icon {
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-icon-${iconId++}`;
  /**
   * * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the color or semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) color?:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>;
  /**
   * Defines the icon to be displayed.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) iconName: IconName;
  /**
   * Defines the size applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) size?: number | BaseSize<BaseSizes>;
  /**
   * Determines whether the component should be mirrored and how.
   * @category Appearance
   */
  @Prop({ reflect: true }) mirror?: 'horizontal' | 'vertical' | 'both';
  /**
   * Determines whether the component should be focusable.
   * @category Behavior
   */
  @Prop({ reflect: true }) focusable?: boolean = false;
  /**
   * Determines whether the component should be rotated and how.
   * @category Appearance
   */
  @Prop({ reflect: true }) rotate?: number;
  /**
   * Determines the accessible label for the component.
   * @category Accessibility
   */
  @Prop() accessibleLabel?: string;

  render() {
    const hasStyleDefiningProp = this.size || this.rotate || this.color;

    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.color && !ColorsWithNoShades.includes(this.color);
    const appliedShadeName = shadeNames.find((shade) => this.color?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.color ? this.color.replace(`-${appliedShadeName}`, '') : this.color;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    return (
      <Host
        tabindex={this.focusable ? 0 : -1}
        aria-labelledby={this.accessibleLabel ? `${this.internalId}-aria-label` : undefined}
      >
        {hasStyleDefiningProp && (
          <style>
            {`:host {
              ${
                this.color
                  ? `--icon-color-1: var(--color-${colorName}${shadeName});
                    --icon-color-2: var(--color-${colorName}${shadeName});`
                  : ''
              }
              ${this.size ? `--svg-icon-size: ${typeof this.size === 'number' ? `${this.size}px;` : this.size};` : ''}
              ${this.rotate ? `div { transform: rotate(${this.rotate}deg); };` : ''}
            }`}
          </style>
        )}
        <div>
          {this.accessibleLabel && (
            <span id={`${this.internalId}-aria-label`} hidden>
              {this.accessibleLabel}
            </span>
          )}
          <slot>{renderAsset(this.iconName)}</slot>
        </div>
      </Host>
    );
  }
}

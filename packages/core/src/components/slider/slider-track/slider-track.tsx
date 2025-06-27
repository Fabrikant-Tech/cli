import { Component, Host, Prop, h } from '@stencil/core';
import {
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  ColorName,
  getAllUniqueShadeNames,
} from '../../../global/types/roll-ups';
import { ColorType, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
} from '../../../reserved/editor-types';
import { Element } from '@stencil/core';
import { calculatePositionFromValue } from '../slider-thumb/utils/utils';
import { toKebabCase } from '../../container/utils/utils';
import { DebugMode } from '../../debug/types/utils';

/**
 * Used with the slider, the Slider Track displays the values on a slider. A user moves a slider thumb along a slider track to select a value, multiple values, or a range of values. You can use multiple slider tracks in a single slider to create a multi select slider.
 *
 * @category Inputs & Forms
 * @parent slider
 */
@Component({
  tag: 'br-slider-track',
  styleUrl: './css/slider-track.css',
  shadow: true,
})
export class SliderTrack {
  /**
   * A reference to the parent slider.
   */
  private parentSliderRef: HTMLBrSliderElement | null;
  /**
   * A reference to the slider thumb element.
   */
  @Element() elm: HTMLBrSliderTrackElement;
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
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`> = 'Primary';
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value: { [key: string]: number | number[] };
  /**
   * Defines the name of the range the component is associated with.
   * @category Data
   * @visibility persistent
   */
  @Prop() associatedRangeName!: string;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;

  componentWillLoad() {
    this.parentSliderRef = this.elm.closest('br-slider');
    if (!this.parentSliderRef && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This slider thumb is not nested in a slider.`, this.elm);
    }
  }

  private calculateLeftAndWidthFromValue = () => {
    const rangeValue = this.value[`${this.associatedRangeName}`];
    if (rangeValue === undefined) {
      return;
    }
    const leftValue = Array.isArray(rangeValue)
      ? calculatePositionFromValue(this.parentSliderRef, rangeValue[0])
      : 0;
    const widthValue = Array.isArray(rangeValue)
      ? calculatePositionFromValue(this.parentSliderRef, rangeValue[1] - rangeValue[0])
      : calculatePositionFromValue(this.parentSliderRef, rangeValue);
    return { left: leftValue, width: widthValue };
  };

  render() {
    const values = this.calculateLeftAndWidthFromValue();
    const styleObject =
      this.parentSliderRef?.orientation === 'vertical'
        ? { bottom: `${values?.left || 0}%`, height: `${values?.width || 0}%` }
        : { left: `${values?.left || 0}%`, width: `${values?.width || 0}%` };

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
      <Host style={styleObject}>
        {hasStyleDefiningProp && (
          <style>
            {this.color &&
              `
                :host {
                    --slider-track-color: ${backgroundColor};
                }`}
          </style>
        )}
      </Host>
    );
  }
}

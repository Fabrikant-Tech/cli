import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';
import {
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  ColorName,
  getAllUniqueShadeNames,
  isCSSColor,
} from '../../global/types/roll-ups';
import { ColorType, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { toKebabCase } from '../container/utils/utils';
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

/**
 * The Progress component indicates how close a task or process is to completion. You can use props to determine the style of the Progress component.
 * @category Display
 */
@Component({
  tag: 'br-progress',
  styleUrl: './css/progress.css',
  shadow: true,
})
export class Progress implements ComponentInterface {
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'> = 'Normal';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: 'Linear' | 'Circular' = 'Circular';
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ reflect: true }) value: number;
  /**
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min: number = 0;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: number = 100;
  /**
   * Determines if the track is shown.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop() hideTrack: boolean = false;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
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
    | undefined = 'Primary';

  private renderLinearProgress = () => {
    return (
      <div class={`${this.hideTrack ? 'br-progress-track-hidden' : ''} br-progress-track`}>
        <div class="br-progress-bar" style={{ width: `${this.value}%` }}></div>
      </div>
    );
  };

  private renderCircularProgress = () => {
    const valueToUse = this.value !== undefined ? this.value : 25;
    const stroke = { Small: 2, Normal: 4, Large: 8 }[this.size];
    const radius = { Small: 6, Normal: 12, Large: 24 }[this.size];
    const diameter = radius * 2 - stroke;
    const circumference = diameter * Math.PI;
    const dashArray = Math.round(circumference * this.max) / this.max;
    const viewBox = radius * 2;
    const value = 1 - (Math.max(valueToUse, this.min + 0.1) - this.min) / this.max;
    const dashOffset = value * circumference || 0;
    const minX = viewBox / 2;
    const minY = viewBox / 2;
    const width = viewBox;
    const height = viewBox;
    const d = `
      M ${viewBox + (radius - stroke / 2)}, ${viewBox}
      a ${radius - stroke / 2},${radius - stroke / 2} 0 1,1 -${radius * 2 - stroke},0
      a ${radius - stroke / 2},${radius - stroke / 2} 0 1,1 ${radius * 2 - stroke},0
    `;

    return (
      <svg viewBox={`${minX} ${minY} ${width} ${height}`} style={{ strokeLinecap: 'inherit' }}>
        {!this.hideTrack && (
          <path class="br-progress-circular-track" fill="transparent" stroke-width={stroke} d={d} />
        )}
        <path
          class="br-progress-circular-bar"
          fill="transparent"
          stroke-width={stroke}
          stroke-dasharray={dashArray}
          stroke-dashoffset={this.value !== undefined ? dashOffset : undefined}
          d={d}
        />
      </svg>
    );
  };

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

    const colorOrType =
      this.color && isCSSColor(this.color)
        ? this.color
        : `var(--color-${colorName}${shadeName || ''})`;

    return (
      <Host
        class={`${this.value !== undefined ? '' : 'br-progress-bar-indeterminate'}`}
        role="progressbar"
        aria-valuenow={this.value}
        aria-valuemin={this.min}
        aria-valuemax={this.max}
      >
        <style>
          {this.color &&
            `
                  :host {
                    --progress-color: ${colorOrType};
                  }`}
        </style>
        {this.shape === 'Linear' && this.renderLinearProgress()}
        {this.shape === 'Circular' && this.renderCircularProgress()}
      </Host>
    );
  }
}

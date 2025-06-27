import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../../reserved/editor-types';
import { ColorName, ColorShadeName } from '../../../global/types/roll-ups';
import { ColorType } from '../../../generated/types/types';
/**
 * The sparkline data component is used to define the data points to display in the sparkline.
 * @category Display
 * @parent sparkline
 */
@Component({
  tag: 'br-sparkline-data',
})
export class SparklineData {
  /**
   * The name of the series.
   */
  @Prop() name: string;
  /**
   * Defines the data points to display in the sparkline.
   * @category Data
   * @visibility persistent
   */
  @Prop() data: number[] = [];
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
   * Event that is emitted when the sparkline is changed.
   */
  @Event() sparklineComponentChanged: EventEmitter<void>;
  render() {
    return <Host />;
  }
}

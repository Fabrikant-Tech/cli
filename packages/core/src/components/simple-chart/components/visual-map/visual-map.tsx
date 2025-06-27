import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
import { BaseHexColor, BaseRgbaColor } from '../../../../reserved/editor-types';
/**
 * The Visual map component works in conjunction with a Heatmap series and defines the value and color ranges.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-visual-map',
})
export class SimpleChartVisualMap {
  /**
   * Whether the visual map selection is realtime.
   * @category Behavior
   */
  @Prop() realtime: boolean = false;
  /**
   * The position of the visual map.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  /**
   * The orientation of the legend.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min: number | 'dataMin' = 'dataMin';
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: number | 'dataMax' = 'dataMax';
  /**
   * Defines the colors applied to the component.
   * @category Appearance
   */
  @Prop() color: Array<BaseHexColor | BaseRgbaColor>;
  /**
   * Whether the visaul map should show a range slider.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showSlider: boolean;
  /**
   * The options for the legend.
   * @category Data
   */
  @Prop() otherOptions: Omit<EChartsOption['visualMap'], 'orient' | 'range' | 'splitNumber'>;
  /**
   * The number of splits in the data.
   * @category Data
   */
  @Prop() splitNumber: number | undefined;
  @Watch('splitNumber')
  splitNumberValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The visual map start start value. Applied when the slider is enabled.
   * @category Data
   * @visibility persistent
   */
  @Prop() startValue: number;
  @Watch('startValue')
  startValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The visual map start start value. Applied when the slider is enabled.
   * @category Data
   * @visibility persistent
   */
  @Prop() endValue: number;
  @Watch('endValue')
  endValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The selected state of the legend. Applied when the split number is set and the slider is disabled.
   * @category Data
   */
  @Prop() selected: Record<number, boolean>;
  @Watch('selected')
  selectedValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

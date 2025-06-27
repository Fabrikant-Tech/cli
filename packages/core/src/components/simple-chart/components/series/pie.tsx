import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
import { BaseHexColor, BaseRgbaColor, CSSVariable } from '../../../../reserved/editor-types';
/**
 * The Pie series component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-pie-series',
})
export class SimpleChartPieSeries {
  /**
   * The name of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() name: string;
  /**
   * The inner radius of the pie.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() innerRadius: number = 0;
  /**
   * The outer radius of the pie.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() outerRadius: number = 1;
  /**
   * Padding between segments.
   * @category Appearance
   */
  @Prop() itemPadding: number = 0;
  /**
   * The border radius of each segment.
   * @category Appearance
   */
  @Prop() itemBorderRadius: number = 0;
  /**
   * The border color of each segment.
   * @category Appearance
   */
  @Prop() itemBorderColor: BaseHexColor | BaseRgbaColor | CSSVariable;
  /**
   * The options for the series
   * @category Data
   */
  @Prop() otherOptions: Omit<EChartsOption['series'], 'name' | 'data' | 'radius'>;
  /**
   * The data of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() data: Array<{ value: number; name: string }>;
  @Watch('data')
  dataChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

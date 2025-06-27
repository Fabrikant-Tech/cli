import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
/**
 * The Heatmap series component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-heatmap-series',
})
export class SimpleChartHeatmapSeries {
  /**
   * The name of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() name: string;
  /**
   * The options for the series
   * @category Data
   */
  @Prop() otherOptions: Omit<EChartsOption['series'], 'name' | 'data'>;
  /**
   * The data of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() data: Array<Array<string | number>>;
  @Watch('data')
  dataChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

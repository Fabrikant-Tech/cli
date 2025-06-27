import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
/**
 * The Legend component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-legend',
})
export class SimpleChartLegend {
  /**
   * The position of the legend.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /**
   * The orientation of the legend.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * The options for the legend.
   * @category Data
   */
  @Prop() otherOptions: Omit<EChartsOption['legend'], 'orient' | 'position' | 'selected'>;
  /**
   * The selected state of the legend.
   * @category Data
   */
  @Prop() selected: Record<string, boolean>;
  @Watch('selected')
  selectedValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

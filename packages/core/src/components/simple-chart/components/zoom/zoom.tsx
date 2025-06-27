import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
/**
 * The Zoom component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-zoom',
})
export class SimpleChartZoom {
  /**
   * A reference to the element.
   */
  @Element() elm: HTMLBrSimpleChartZoomElement;
  /**
   * The type of the zoom. Slider displays a range slider, inside enables zooming using the scroll wheel on the chart.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() type: 'inside' | 'slider' = 'slider';
  /**
   * Whether the zoom is realtime.
   * @category Behavior
   */
  @Prop() realtime: boolean = false;
  /**
   * The index of the x axis it is attached to.
   * @category Data
   */
  @Prop() xAxisIndex: number;
  /**
   * The index of the y axis it is attached to.
   * @category Data
   */
  @Prop() yAxisIndex: number;
  /**
   * Whether the zoom should be shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() show: boolean = true;
  @Watch('show')
  showChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The zoom start value.
   * @category Data
   * @visibility persistent
   */
  @Prop() startValue: number | string | Date;
  @Watch('startValue')
  startValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The zoom end value.
   * @category Data
   * @visibility persistent
   */
  @Prop() endValue: number | string | Date;
  @Watch('startValue')
  endValueChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The options for the legend.
   * @category Data
   */
  @Prop() otherOptions: Omit<
    EChartsOption['dataZoom'],
    'xAxisIndex' | 'yAxisIndex' | 'type' | 'realtime' | 'startValue' | 'endValue' | 'show'
  >;
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

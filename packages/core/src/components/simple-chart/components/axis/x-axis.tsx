import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
import { BaseHexColor, BaseRgbaColor, CSSVariable } from '../../../../reserved/editor-types';
/**
 * The X Axis component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-x-axis',
})
export class SimpleChartXAxis {
  /**
   * The position of the axis.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() position: 'top' | 'bottom' = 'bottom';
  /**
   * The type of the axis.
   * @category Data
   * @visibility persistent
   */
  @Prop() type: 'value' | 'category' | 'time' | 'log' = 'category';
  /**
   * Whether the axis should trigger events.
   * @category Behavior
   */
  @Prop() triggerEvent: boolean = true;
  /**
   * Whether to show the axis tooltip.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showTooltip?: boolean = false;
  /**
   * Whether to show the axis label.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showAxisLabel?: boolean = true;
  /**
   * How to format the label.
   * @category Appearance
   */
  @Prop() axisLabelFormatter?: (
    value: number | string,
    index: number,
  ) =>
    | string
    | ((
        value: number,
        index: number,
        extra: {
          level: number;
        },
      ) => string);
  /**
   *
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min?: number | string | 'dataMin' = 'dataMin';
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max?: number | string | 'dataMax' = 'dataMax';
  /**
   * The padding for the data on each side of the axis.
   * @category Appearance
   */
  @Prop() dataPadding: 'auto' | false | [number, number] = 'auto';
  /**
   * Show tick.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showTick: boolean = true;
  /**
   * Whether to show and the number of minor ticks to show.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showMinorTick: false | number = false;
  /**
   * Whether the axis line should be shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showAxisLine: boolean = true;
  /**
   * Whether the axis split line should be shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showAxisSplitLine: boolean = true;
  /**
   * Whether the  axis minor split line should be shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showAxisMinorSplitLine: boolean = false;
  /**
   * Whether the split area should be shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showSplitArea: boolean = false;
  /**
   * The starting value for the axis.
   * @category Data
   */
  @Prop() startValue?: number | string;
  /**
   * The type of axis pointer.
   * @category Appearance
   */
  @Prop() axisPointer?: boolean = false;
  /**
   * The options for the axis.
   * @category Data
   */
  @Prop() otherOptions: Omit<EChartsOption['xAxis'], 'data' | 'type' | 'position'>;
  /**
   * Whether to show the axis.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() show: boolean = true;
  @Watch('show')
  showChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * The data of the axis.
   * @category Data
   * @visibility persistent
   */
  @Prop() data: Array<
    | string
    | number
    | {
        value: string | number;
        textStyle: {
          color: BaseHexColor | BaseRgbaColor | CSSVariable;
        };
      }
  >;
  @Watch('data')
  dataChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
import { ChartFillColor } from '../../types/chart-types';
import { BaseHexColor, BaseOpacityModel, BaseRgbaColor } from '../../../../reserved/editor-types';
/**
 * The Line series component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-line-series',
})
export class SimpleChartLineSeries {
  /**
   * The name of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() name: string;
  /**
   * The x axis index the series is associated with.
   * @category Data
   */
  @Prop() xAxisIndex: number = 0;
  /**
   * The y axis index the series is associated with.
   * @category Data
   */
  @Prop() yAxisIndex: number = 0;
  /**
   * Whether the line of the series should trigger events even if there is no symbol.
   * @category Behavior
   */
  @Prop() triggerLineEvent: boolean = true;
  /**
   * The symbol of the series.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() symbol:
    | 'circle'
    | 'rect'
    | 'roundRect'
    | 'triangle'
    | 'diamond'
    | 'pin'
    | 'arrow'
    | 'none' = 'none';
  /**
   * The color of the line.
   * @category Appearance
   */
  @Prop() color?: BaseHexColor | BaseRgbaColor | 'auto';
  /**
   * Defines the opacity of the component.
   * @category Appearance
   */
  @Prop() opacity: BaseOpacityModel = '1';
  /**
   * The width of the line.
   * @category Appearance
   */
  @Prop() width: number = 1;
  /**
   * The color of the area.
   * @category Appearance
   */
  @Prop() fillColor?: BaseHexColor | BaseRgbaColor | ChartFillColor | 'auto';
  /**
   * The opacity of the area.
   * @category Appearance
   */
  @Prop() fillOpacity: number = 0.25;
  /**
   * Whether the line should be shown as a step.
   * @category Appearance
   */
  @Prop() step?: boolean | 'start' | 'middle' | 'end';
  /**
   * Whether the line should be smooth.
   * @category Appearance
   */
  @Prop() smooth?: boolean;
  /**
   * The options for the series
   * @category Data
   */
  @Prop() otherOptions: Omit<
    EChartsOption['series'],
    | 'name'
    | 'data'
    | 'type'
    | 'position'
    | 'xAxisIndex'
    | 'yAxisIndex'
    | 'triggerLineEvent'
    | 'step'
    | 'symbol'
    | 'smooth'
  >;
  /**
   * The data of the series.
   * @category Data
   * @visibility persistent
   */
  @Prop() data: Array<number | string | null> | Array<Array<number | string | null>>;
  @Watch('data')
  dataChanged() {
    this.chartComponentChanged.emit();
  }
  /**
   * Event that is emitted when the series is changed.
   */
  @Event() chartComponentChanged: EventEmitter<void>;
}

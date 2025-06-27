import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { EChartsOption } from 'echarts';
import { ChartFillColor } from '../../types/chart-types';
import { SizeUnit } from '../../../../generated/types/variables';
import { BaseHexColor, BaseOpacityModel, BaseRgbaColor } from '../../../../reserved/editor-types';
/**
 * The Scatter series component for the Simple Chart.
 * @category Display
 * @parent simple-chart
 */
@Component({
  tag: 'br-simple-chart-scatter-series',
})
export class SimpleChartScatterSeries {
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
   * The color of the bar.
   * @category Appearance
   */
  @Prop() color?: BaseHexColor | BaseRgbaColor | ChartFillColor | 'auto';
  /**
   * Defines the opacity of the component.
   * @category Appearance
   */
  @Prop() opacity: BaseOpacityModel = '1';
  /**
   * The size of the symbol.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() size: number = Number(SizeUnit.replace('px', '')) * 2;
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
    | 'none' = 'circle';
  /**
   * The options for the series
   * @category Data
   */
  @Prop() otherOptions: Omit<
    EChartsOption['series'],
    'name' | 'data' | 'type' | 'position' | 'xAxisIndex' | 'yAxisIndex'
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

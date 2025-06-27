import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  Watch,
} from '@stencil/core';
import { init, registerTheme, ECharts, EChartsOption, ECElementEvent } from 'echarts';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { SizeUnit } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { getChartConfig } from './config/config';
import { ChartDataZoomEventData, ChartLegendSelectionEventData } from './types/chart-types';
import { isEqual } from 'lodash-es';

/**
 * The Chart component enables the display of data in a visual way.
 * @category Display
 * @slot - Passes the content to the chart.
 */
@Component({
  tag: 'br-simple-chart',
  styleUrl: 'css/simple-chart.css',
  shadow: true,
})
export class SimpleChart {
  /**
   * A resize observer to watch for changes in the inner content.
   */
  private resizeObserver: ResizeObserver;
  /**
   * A reference to the chart container.
   */
  private chartContainer!: HTMLDivElement;
  /**
   * A reference to the chart instance.
   */
  private chartInstance: ECharts | null = null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSimpleChartElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  @Watch('theme')
  handleThemeChange() {
    this.destroyChart();
    this.initializeChart();
  }
  /**
   * The chart options configuration object.
   * @category Data
   */
  @Prop() otherOptions: EChartsOption;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) width: BaseSize<BaseSizes> = '100%';
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) height: BaseSize<BaseSizes> = '400px';
  /**
   * Whether the tooltip is shown.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showTooltip: boolean = true;
  /**
   * The trigger for the tooltip.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() tooltipTrigger: 'item' | 'axis' | 'none' = 'item';
  /**
   * Removes the padding around the chart grid.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() noPadding: boolean = false;
  /**
   * The tooltip axis pointer.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() tooltipAxisPointer: boolean = true;
  /**
   * An event that emits when a data zoom event is triggered.
   */
  @Event() dataZoom: EventEmitter<ChartDataZoomEventData>;
  /**
   * An event that emits when a data zoom event is triggered.
   */
  @Event() legendSelected: EventEmitter<ChartLegendSelectionEventData>;
  /**
   * An event that emits when an axis or series is clicked.
   */
  @Event() click: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when a mouse over happens on an axis or series.
   */
  @Event() mouseOver: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when a mouse down happens on an axis or series.
   */
  @Event() mouseDown: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when a mouse up happens on an axis or series.
   */
  @Event() mouseUp: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when a mouse move happens on an axis or series.
   */
  @Event() mouseMove: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when a mouse out happens on an axis or series.
   */
  @Event() mouseOut: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when the mouse leaves the chart.
   */
  @Event() globalMouseOut: EventEmitter<ECElementEvent>;
  /**
   * An event that emits when the visual map data range is changed.
   */
  @Event() visualMapSelected: EventEmitter<ECElementEvent>;
  /**
   * A method to retrieve the chart instance.
   */
  @Method()
  async getChartInstance(): Promise<ECharts | undefined | null> {
    return this.chartInstance;
  }
  /**
   * A method to update the chart instance.
   */
  @Method()
  async updateChartInstance(): Promise<ECharts | undefined | null> {
    this.destroyChart();
    this.initializeChart();
    return this.chartInstance;
  }

  componentWillLoad() {
    this.resizeObserver = new ResizeObserver(this.resizeChart);
  }

  componentDidLoad() {
    this.resizeObserver.observe(this.elm);
    this.initializeChart();
  }

  disconnectedCallback() {
    this.destroyChart();
  }

  private getOptionsToUpdate = () => {
    this.chartInstance = init(this.chartContainer, this.theme, { renderer: 'svg' });

    const sizeUnitAsNumber = Number(SizeUnit.replace('px', ''));

    let series: Array<
      | HTMLBrSimpleChartLineSeriesElement
      | HTMLBrSimpleChartScatterSeriesElement
      | HTMLBrSimpleChartBarSeriesElement
      | HTMLBrSimpleChartPieSeriesElement
      | HTMLBrSimpleChartHeatmapSeriesElement
    > = [];

    ['line', 'bar', 'scatter', 'pie', 'heatmap'].forEach((type) => {
      series = [
        ...(series ? series : []),
        ...(Array.from(this.elm.querySelectorAll(`br-simple-chart-${type}-series`)) as Array<
          | HTMLBrSimpleChartLineSeriesElement
          | HTMLBrSimpleChartScatterSeriesElement
          | HTMLBrSimpleChartBarSeriesElement
          | HTMLBrSimpleChartPieSeriesElement
          | HTMLBrSimpleChartHeatmapSeriesElement
        >),
      ];
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composedSeriesOptions: any = [];

    series.forEach(
      (
        seriesEl:
          | HTMLBrSimpleChartLineSeriesElement
          | HTMLBrSimpleChartScatterSeriesElement
          | HTMLBrSimpleChartBarSeriesElement
          | HTMLBrSimpleChartPieSeriesElement
          | HTMLBrSimpleChartHeatmapSeriesElement,
      ) => {
        const typeRegex = new RegExp(/(?<=br-simple-chart-).*(?=-series)/g);
        const matches = seriesEl.tagName.toLowerCase().match(typeRegex);
        const type = matches ? matches[0] : 'bar';
        let thisSeries = {};

        if (type === 'line') {
          const lineSeries = seriesEl as HTMLBrSimpleChartLineSeriesElement;

          thisSeries = {
            type: 'line',
            name: seriesEl.name,
            data: lineSeries.data,
            xAxisIndex: lineSeries.xAxisIndex,
            yAxisIndex: lineSeries.yAxisIndex,
            symbol: lineSeries.symbol,
            triggerLineEvent: lineSeries.triggerLineEvent,
            step: lineSeries.step,
            smooth: lineSeries.smooth,
            lineStyle: {
              color: lineSeries.color !== 'auto' ? lineSeries.color : undefined,
              opacity: lineSeries.opacity,
              width: lineSeries.width,
            },
            areaStyle: lineSeries.fillColor
              ? {
                  color: lineSeries.fillColor !== 'auto' ? lineSeries.fillColor : undefined,
                  opacity: lineSeries.fillOpacity,
                }
              : undefined,
            ...lineSeries.otherOptions,
          };

          composedSeriesOptions = [...(composedSeriesOptions || []), thisSeries];
        }
        if (type === 'bar') {
          const barSeries = seriesEl as HTMLBrSimpleChartBarSeriesElement;

          thisSeries = {
            type: 'bar',
            name: seriesEl.name,
            data: barSeries.data,
            xAxisIndex: barSeries.xAxisIndex,
            yAxisIndex: barSeries.yAxisIndex,
            itemStyle: {
              color: barSeries.color !== 'auto' ? barSeries.color : undefined,
              opacity: barSeries.opacity,
            },
            barWidth: barSeries.width,
            ...barSeries.otherOptions,
          };

          composedSeriesOptions = [...(composedSeriesOptions || []), thisSeries];
        }
        if (type === 'scatter') {
          const scatterSeries = seriesEl as HTMLBrSimpleChartScatterSeriesElement;

          thisSeries = {
            type: 'scatter',
            name: seriesEl.name,
            data: scatterSeries.data,
            xAxisIndex: scatterSeries.xAxisIndex,
            yAxisIndex: scatterSeries.yAxisIndex,
            itemStyle: {
              color: scatterSeries.color !== 'auto' ? scatterSeries.color : undefined,
              opacity: scatterSeries.opacity,
            },
            symbol: scatterSeries.symbol,
            symbolSize: scatterSeries.size,
            emphasis: {
              scale: 0.9,
            },
            ...scatterSeries.otherOptions,
          };

          composedSeriesOptions = [...(composedSeriesOptions || []), thisSeries];
        }
        if (type === 'pie') {
          const pieSeries = seriesEl as HTMLBrSimpleChartPieSeriesElement;

          thisSeries = {
            type: 'pie',
            name: seriesEl.name,
            data: pieSeries.data,
            label: {
              show: false,
            },
            itemStyle: {
              borderRadius: pieSeries.itemBorderRadius,
              borderColor: pieSeries.itemBorderColor ? pieSeries.itemBorderColor : 'transparent',
              borderWidth: pieSeries.itemPadding,
            },
            emphasis: {
              scaleSize: -10,
            },
            radius: [`${pieSeries.innerRadius * 100}%`, `${pieSeries.outerRadius * 100}%`],
            ...pieSeries.otherOptions,
          };

          composedSeriesOptions = [...(composedSeriesOptions || []), thisSeries];
        }
        if (type === 'heatmap') {
          const heatmapSeries = seriesEl as HTMLBrSimpleChartHeatmapSeriesElement;

          thisSeries = {
            type: 'heatmap',
            name: seriesEl.name,
            data: heatmapSeries.data,
            label: {
              show: false,
            },
            ...heatmapSeries.otherOptions,
          };

          composedSeriesOptions = [...(composedSeriesOptions || []), thisSeries];
        }
      },
    );

    const optionsSeries = this.otherOptions && this.otherOptions.series;
    const builtInSeries = Array.isArray(optionsSeries) ? optionsSeries : [optionsSeries];

    composedSeriesOptions = [...(composedSeriesOptions || []), ...builtInSeries];

    const xAxis = this.elm.querySelectorAll('br-simple-chart-x-axis');
    const yAxis = this.elm.querySelectorAll('br-simple-chart-y-axis');
    const legend = this.elm.querySelector('br-simple-chart-legend');
    const dataZoom = this.elm.querySelectorAll('br-simple-chart-zoom');
    const visualMap = this.elm.querySelector('br-simple-chart-visual-map');

    const gridDefault = {
      containLabel: true, // Ensures labels are contained
      left: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
      top: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
      right: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
      bottom: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
    };
    const positionCartesian = (position?: 'top' | 'bottom' | 'left' | 'right') => {
      const options: {
        top: string | number | undefined;
        left: string | number | undefined;
        bottom: string | number | undefined;
        right: string | number | undefined;
      } = {
        left: 'auto',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
      };
      if (position === 'top') {
        options['top'] = 0;
        options['left'] = 'center';
        options['right'] = undefined;
        options['bottom'] = undefined;
      }
      if (position === 'bottom') {
        options['bottom'] = 0;
        options['left'] = 'center';
        options['right'] = undefined;
        options['top'] = undefined;
      }
      if (position === 'left') {
        options['top'] = 'center';
        options['left'] = 0;
        options['right'] = undefined;
        options['bottom'] = undefined;
      }
      if (position === 'right') {
        options['top'] = 'center';
        options['right'] = 0;
        options['left'] = undefined;
        options['bottom'] = undefined;
      }
      return options;
    };

    const updatedOptions = {
      ...this.otherOptions,
      animation: false,
      xAxis: Array.from(xAxis || []).map((axis) => {
        return {
          show: axis.show,
          type: axis.type,
          position: axis.position,
          tooltip: {
            show: axis.showTooltip,
          },
          axisLine: {
            show: axis.showAxisLine,
          },
          splitLine: {
            show: axis.showAxisSplitLine,
          },
          minorSplitLine: {
            show: axis.showAxisMinorSplitLine,
          },
          axisLabel: {
            show: axis.show ? axis.showAxisLabel : false,
            formatter: axis.axisLabelFormatter,
          },
          axisTick: {
            show: axis.showTick,
          },
          splitArea: {
            show: axis.showSplitArea,
          },
          startValue: axis.startValue,
          axisPointer: {
            show: axis.axisPointer !== false,
            type: axis.axisPointer !== false ? 'line' : 'none',
          },
          minorTick: {
            show: axis.showMinorTick !== false,
            splitNumber: axis.showMinorTick || 5,
          },
          min: axis.min,
          max: axis.max,
          boundaryGap: axis.dataPadding === 'auto' || axis.dataPadding,
          data: axis.data,
          triggerEvent: axis.triggerEvent,
          ...axis.otherOptions,
        };
      }),
      yAxis: Array.from(yAxis || []).map((axis) => {
        return {
          show: axis.show,
          type: axis.type,
          position: axis.position,
          tooltip: {
            show: axis.showTooltip,
          },
          axisLine: {
            show: axis.showAxisLine,
          },
          splitLine: {
            show: axis.showAxisSplitLine,
          },
          minorSplitLine: {
            show: axis.showAxisMinorSplitLine,
          },
          axisLabel: {
            show: axis.show ? axis.showAxisLabel : false,
            formatter: axis.axisLabelFormatter,
          },
          axisTick: {
            show: axis.showTick,
          },
          splitArea: {
            show: axis.showSplitArea,
          },
          startValue: axis.startValue,
          axisPointer: {
            show: axis.axisPointer !== false,
            type: axis.axisPointer !== false ? 'line' : 'none',
          },
          minorTick: {
            show: axis.showMinorTick !== false,
            splitNumber: axis.showMinorTick || 5,
          },
          min: axis.min,
          max: axis.max,
          boundaryGap: axis.dataPadding === 'auto' || axis.dataPadding,
          data: axis.data,
          triggerEvent: axis.triggerEvent,
          ...axis.otherOptions,
        };
      }),
      visualMap: visualMap
        ? {
            show: !!visualMap,
            type: visualMap.showSlider ? 'continuous' : 'piecewise',
            min: visualMap.min,
            max: visualMap.max,
            color: visualMap.color ? [...visualMap.color].reverse() : undefined,
            orient: visualMap.orientation,
            calculable: visualMap.showSlider,
            splitNumber: visualMap.splitNumber,
            hoverLinkOnHandle: false,
            realtime: visualMap.realtime,
            range:
              visualMap.startValue !== undefined || visualMap.endValue !== undefined
                ? [visualMap.startValue, visualMap.endValue]
                : undefined,
            ...positionCartesian(visualMap.position),
            itemWidth: visualMap.showSlider ? sizeUnitAsNumber * 6 : sizeUnitAsNumber * 3,
            itemHeight: !visualMap.showSlider ? sizeUnitAsNumber * 3 : undefined,
            controller: {
              outOfRange: {
                opacity: visualMap.splitNumber ? 1 : 0.15,
              },
            },
            ...visualMap.otherOptions,
          }
        : undefined,
      legend: {
        show: !!legend,
        orient: legend?.orientation,
        position: legend?.position,
        selected: legend?.selected,
        ...positionCartesian(legend?.position),
        ...(legend?.otherOptions || {}),
      },
      dataZoom: Array.from(dataZoom || []).map((zoom) => {
        return {
          show: zoom.show,
          type: zoom.type,
          realtime: zoom.realtime,
          startValue: zoom.startValue,
          endValue: zoom.endValue,
          xAxisIndex: zoom.xAxisIndex,
          yAxisIndex: zoom.yAxisIndex,
          ...(zoom.otherOptions || {}),
        };
      }),
      tooltip: {
        show: this.showTooltip,
        trigger: this.tooltipTrigger,
        axisPointer: {
          type: this.tooltipAxisPointer ? 'line' : 'none',
        },
      },
      series: [...composedSeriesOptions],
      grid: gridDefault,
    };
    return updatedOptions;
  };

  private initializeChart() {
    if (this.chartContainer) {
      registerTheme('Light', getChartConfig('Light').theme);
      registerTheme('Dark', getChartConfig('Dark').theme);
      const width = this.fullWidth ? '100%' : this.width;
      const height = this.fullHeight ? '100%' : this.height;
      this.elm.style.setProperty('--chart-width', width);
      this.elm.style.setProperty('--chart-height', height);
      this.chartInstance = init(this.chartContainer, this.theme, { renderer: 'svg' });

      const sizeUnitAsNumber = Number(SizeUnit.replace('px', ''));

      const legend = this.elm.querySelector('br-simple-chart-legend');
      const dataZoom = this.elm.querySelectorAll('br-simple-chart-zoom');
      const visualMap = this.elm.querySelector('br-simple-chart-visual-map');

      const gridDefault = {
        containLabel: true, // Ensures labels are contained
        left: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
        top: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
        right: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
        bottom: this.noPadding ? 0 : sizeUnitAsNumber * 1.5,
      };

      const updatedOptions = this.getOptionsToUpdate();
      this.chartInstance.setOption(updatedOptions);

      this.initializeActions();

      // NOTE: This is a workaround to get the components map
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const components = (this.chartInstance as any)._componentsMap;
      const entries = Object.entries(components);

      const legendComponent = entries.find((en) => en[0].includes('legend'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const legendEntry = legendComponent ? (legendComponent[1] as any) : undefined;
      const legendGroup = legendEntry ? legendEntry.group : undefined;
      const legendRect = legendGroup ? legendGroup.getBoundingRect() : undefined;
      const legendHeight = legendRect ? legendRect.height : 0;
      const legendWidth = legendRect ? legendRect.width : 0;

      const visualMapComponent = entries.find((en) => en[0].includes('visualMap'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visualMapEntry = visualMapComponent ? (visualMapComponent[1] as any) : undefined;
      const visualMapGroup = visualMapEntry ? visualMapEntry.group : undefined;
      const visualMapRect = visualMapGroup ? visualMapGroup.getBoundingRect() : undefined;
      const visualMapHeight = visualMapRect ? visualMapRect.height : 0;
      const visualMapWidth = visualMapRect ? visualMapRect.width : 0;

      const dataZoomComponent = entries.filter((en) => en[0].includes('dataZoom'));
      const zoomOnX = dataZoomComponent
        ? dataZoomComponent.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (dz: any) =>
              dz[1].dataZoomModel.option.type === 'slider' &&
              (dz[1].dataZoomModel.option.xAxisIndex ||
                (dz[1].dataZoomModel.option.xAxisIndex === undefined &&
                  dz[1].dataZoomModel.option.yAxisIndex === undefined)),
          )
        : undefined;

      const zoomOnY = dataZoomComponent
        ? dataZoomComponent?.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (dz: any) =>
              dz[1].dataZoomModel.option.type === 'slider' &&
              dz[1].dataZoomModel.option.yAxisIndex !== undefined,
          )
        : undefined;

      let zoomOnXHeight = 0;
      if (zoomOnX) {
        zoomOnX.map((z) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const zComponent = z[1] as any;
          const height = zComponent._size[1];
          const handle = zComponent._displayables.moveHandle.shape.height;
          zoomOnXHeight = zoomOnXHeight + height + handle;
        });
      }

      let zoomOnYWidth = 0;
      if (zoomOnY) {
        zoomOnY.map((z) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const zComponent = z[1] as any;
          const width = zComponent._size[1];
          const handle = zComponent._displayables.moveHandle.shape.height;
          zoomOnYWidth = zoomOnYWidth + width + handle;
        });
      }

      const topExtra =
        (legend && legend.position === 'top' ? legendHeight : 0) +
        (visualMap && visualMap.position === 'top' ? visualMapHeight : 0);
      const rightExtra =
        (legend && legend.position === 'right' ? legendWidth : 0) +
        (visualMap && visualMap.position === 'right' ? visualMapWidth : 0) +
        (zoomOnYWidth ? zoomOnYWidth + sizeUnitAsNumber * 1.5 : zoomOnYWidth);
      const bottomExtra =
        (legend && legend.position === 'bottom' ? legendHeight : 0) +
        (visualMap && visualMap.position === 'bottom' ? visualMapHeight : 0) +
        (zoomOnXHeight ? zoomOnXHeight + sizeUnitAsNumber * 1.5 : zoomOnXHeight);
      const leftExtra =
        (legend && legend.position === 'left' ? legendWidth : 0) +
        (visualMap && visualMap.position === 'left' ? visualMapWidth : 0);

      if (topExtra || rightExtra || bottomExtra || leftExtra) {
        this.chartInstance?.setOption({
          dataZoom: Array.from(dataZoom || []).map((zoom) => {
            const defaultPosition: {
              top?: string | number | undefined;
              bottom?: string | number | undefined;
              left?: string | number | undefined;
              right?: string | number | undefined;
            } = {};
            if (zoom.type === 'slider' && zoom.yAxisIndex === undefined) {
              if (legend && legend.position === 'bottom') {
                defaultPosition.bottom = legendHeight + sizeUnitAsNumber * 3;
                defaultPosition.top = undefined;
              }
            }
            if (zoom.type === 'slider' && zoom.yAxisIndex !== undefined) {
              if (legend && legend.position === 'right') {
                defaultPosition.right = legendWidth + sizeUnitAsNumber * 3;
                defaultPosition.left = undefined;
              }
            }
            return {
              show: zoom.show,
              type: zoom.type,
              realtime: zoom.realtime,
              startValue: zoom.startValue,
              endValue: zoom.endValue,
              xAxisIndex: zoom.xAxisIndex,
              yAxisIndex: zoom.yAxisIndex,
              ...defaultPosition,
              ...(zoom.otherOptions || {}),
            };
          }),
          grid: {
            left: gridDefault.left + leftExtra,
            right: gridDefault.right + rightExtra,
            top: gridDefault.top + topExtra,
            bottom: gridDefault.bottom + bottomExtra,
          },
        });
      }

      const visualMapElement = this.elm.querySelector('br-simple-chart-visual-map');
      const selected = visualMapEntry?.visualMapModel?.option.selected;
      if (
        visualMapEntry &&
        visualMapElement &&
        visualMapElement.selected &&
        visualMapElement.splitNumber &&
        !isEqual(selected, visualMapElement.selected)
      ) {
        this.chartInstance?.dispatchAction({
          type: 'selectDataRange',
          selected: visualMapElement.selected,
        });
      }

      window.addEventListener('resize', this.resizeChart);
      this.resizeChart();
    }
  }

  @Listen('chartComponentChanged')
  handleChartComponentChanged() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function filterFirstLevel(obj: any, allowedKeys: string[]) {
      return Object.keys(obj).reduce((acc, key) => {
        if (allowedKeys.includes(key)) {
          acc[key] = obj[key];
        }
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any);
    }
    const updatedOptions = this.getOptionsToUpdate();
    const keys = Object.keys(updatedOptions);
    const currentOptions = this.chartInstance?.getOption();
    const optionsToCheck = filterFirstLevel(currentOptions, keys);
    if (!isEqual(updatedOptions, optionsToCheck)) {
      this.destroyChart();
      this.initializeChart();
    }
  }

  private initializeActions = () => {
    this.chartInstance?.on('datazoom', (params: ChartDataZoomEventData) => {
      this.dataZoom.emit(params);
    });
    this.chartInstance?.on('legendselectchanged', (params: ChartLegendSelectionEventData) => {
      this.legendSelected.emit(params);
    });

    const zr = this.chartInstance?.getZr();

    this.chartInstance?.on('click', (params: ECElementEvent) => {
      this.click.emit(params);
    });
    if (zr) {
      zr.on('click', (params: ECElementEvent) => {
        if (!params.target) {
          this.click.emit(params);
        }
      });
    }

    this.chartInstance?.on('mouseout', (params: ECElementEvent) => {
      this.mouseOut.emit(params);
    });

    this.chartInstance?.on('mousemove', (params: ECElementEvent) => {
      this.mouseMove.emit(params);
    });
    this.chartInstance?.on('mouseover', (params: ECElementEvent) => {
      this.mouseOver.emit(params);
    });
    this.chartInstance?.on('mousedown', (params: ECElementEvent) => {
      this.mouseDown.emit(params);
    });
    this.chartInstance?.on('mouseup', (params: ECElementEvent) => {
      this.mouseUp.emit(params);
    });
    this.chartInstance?.on('globalout', (params: ECElementEvent) => {
      this.globalMouseOut.emit(params);
    });
    this.chartInstance?.on('datarangeselected', (params: ECElementEvent) => {
      this.visualMapSelected.emit(params);
    });
  };

  private resizeChart = () => {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  };

  private destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener('resize', this.resizeChart);
  }

  render() {
    const width = this.fullWidth ? '100%' : this.width;
    const height = this.fullHeight ? '100%' : this.height;
    return (
      <Host>
        <div
          ref={(el) => (this.chartContainer = el as HTMLDivElement)}
          style={{ width: width, height: height, pointerEvents: 'all' }}
        ></div>
      </Host>
    );
  }

  componentWillUpdate() {
    if (this.chartInstance && this.otherOptions) {
      this.chartInstance.setOption(this.otherOptions);
    }
  }
}

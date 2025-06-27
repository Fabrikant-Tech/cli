import {
  Component,
  ComponentInterface,
  Element,
  Fragment,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { BaseSize, BaseSizes, GenericZeroToOne } from '../../reserved/editor-types';
import { Theme } from '../../generated/types/types';
import { Colors, ThemeDefault } from '../../generated/types/variables';
import { flatten, isEqual } from 'lodash-es';
import { ColorShadeNameDefault, getAllUniqueShadeNames } from '../../global/types/roll-ups';

// This id increments for all buttons on the page
let sparklineId = 0;

/**
 * The sparkline component is used to display data in a small, simple, and condensed format.
 * @category Display
 * @slot - Passes the data to the sparkline.
 */
@Component({
  tag: 'br-sparkline',
  styleUrl: './css/sparkline.css',
  shadow: true,
})
export class Sparkline implements ComponentInterface {
  /**
   * A reference to the tooltip component.
   */
  private tooltipRef: HTMLBrTooltipElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSparklineElement;
  /**
   * The sparkline data.
   */
  @State() data: HTMLBrSparklineDataElement[] = [];
  /**
   * The internal set min.
   */
  @State() internalMin: number;
  /**
   * The internal set max.
   */
  @State() internalMax: number;
  /**
   * The hovered element.
   */
  @State() hoveredElement:
    | {
        point: number;
        series?: string;
        value?: number;
      }
    | undefined;
  @Watch('hoveredElement')
  hoveredElementChanged(
    newValue:
      | {
          point: number;
          series?: string;
          value?: number;
        }
      | undefined,
    oldValue:
      | {
          point: number;
          series?: string;
          value?: number;
        }
      | undefined,
  ) {
    if (!isEqual(newValue, oldValue)) {
      const group = newValue?.point;
      const series = newValue?.series;
      const value = newValue?.value;
      const target =
        this.elm.shadowRoot?.querySelector(
          `*[id="sparkline-bar-${group}-${series}-${value}"]:not(.br-sparkline-bar-inert)`,
        ) ||
        this.elm.shadowRoot?.querySelector(`*[id="sparkline-bar-${group}"]`) ||
        this.elm.shadowRoot?.querySelector(`*[id="sparkline-hover-line"]`);
      this.tooltipRef?.closeElement();
      if (target && newValue) {
        this.tooltipRef?.openElement(target);
      }
    }
  }
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-sparkline-${sparklineId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Defines the type of sparkline to display.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) type: 'bar' | 'line' = 'bar';
  /**
   * Defines the direction of the sparkline.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'vertical';
  /**
   * The minimum value of the data points.
   * @category Data
   * @visibility persistent
   */
  @Prop() min: number;
  /**
   * The maximum value of the data points.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: number;
  /**
   * Whether the sparkline is stacked.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() stacked: boolean;
  /**
   * Whether the gap should be displayed between the sparkline data.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showGap: boolean = false;
  /**
   * Whether a tootlip should be displayed on hover.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() showTooltip: boolean = true;
  /**
   * A function to format the value that appears in the tooltip.
   * @category Behavior
   */
  @Prop() formatValue: (value: number, index: number | undefined) => string = (value) =>
    value.toString();

  private adjustBounds = () => {
    const data = flatten(this.data.map((series) => series.data));
    if (!this.stacked) {
      this.internalMin = Math.min(...data);
      this.internalMax = Math.max(...data);
    } else {
      const itemsCount = this.data[0].data.length;
      const pointArray = Array.from({ length: itemsCount }, (_, i) => i);
      const sums = pointArray.map((group) => {
        return this.data.map((series) => series.data[group]).reduce((a, b) => a + b, 0);
      });
      this.internalMin = Math.min(...sums, Math.min(...data));
      this.internalMax = Math.max(...sums, Math.max(...data));
    }
  };

  componentWillLoad(): Promise<void> | void {
    this.data = Array.from(this.elm.querySelectorAll('br-sparkline-data'));
    this.adjustBounds();
  }

  @Listen('sparklineComponentChanged')
  handleSparklineComponentChanged() {
    this.data = Array.from(this.elm.querySelectorAll('br-sparkline-data'));
    this.adjustBounds();
  }

  render() {
    const minToUse = this.min !== undefined ? this.min : this.internalMin;
    const maxToUse = this.max !== undefined ? this.max : this.internalMax;

    const renderTypes = () => {
      const absSize = Math.abs(maxToUse - minToUse);
      if (!this.data) {
        return;
      }
      if (this.type === 'bar') {
        const itemsCount = this.data[0].data.length;
        const pointArray = Array.from({ length: itemsCount }, (_, i) => i);
        const position =
          (minToUse < 0 && maxToUse > 0 && 'middle') || (minToUse >= 0 && 'positive') || 'negative';
        const negativePercentage = (
          minToUse < 0 ? `${(Math.abs(minToUse) / absSize) * 100}%` : `0%`
        ) as `${number}%`;
        const positivePercentage =
          minToUse < 0
            ? (`${((absSize - Math.abs(minToUse)) / absSize) * 100}%` as `${number}%`)
            : '100%';
        return (
          <Fragment>
            {pointArray.map((group) => {
              const height: BaseSize<BaseSizes> =
                !this.stacked && this.direction === 'horizontal'
                  ? `calc(100% / ${this.data.length})`
                  : '100%';
              const width: BaseSize<BaseSizes> =
                !this.stacked && this.direction === 'vertical'
                  ? `calc(100% / ${this.data.length})`
                  : '100%';
              return (
                <br-container
                  key={`sparkline-bar-${group}`}
                  id={`sparkline-bar-${group}`}
                  fullWidth={true}
                  fullHeight={true}
                  shrink={true}
                  direction={this.direction === 'vertical' ? 'row' : 'column'}
                  directionAlignment="start"
                  backgroundColor={{
                    color: this.theme === 'Light' ? 'Primary' : 'Primary-100',
                    opacity:
                      this.hoveredElement && this.hoveredElement.point === group ? '0.1' : '0',
                  }}
                >
                  <br-container
                    width="100%"
                    height="100%"
                    shrink={true}
                    direction={this.direction === 'vertical' ? 'column' : 'row-reverse'}
                    style={{
                      pointerEvents: 'all',
                    }}
                    onMouseOver={() => {
                      this.hoveredElement = {
                        point: group,
                      };
                    }}
                    onMouseLeave={() => {
                      this.hoveredElement = undefined;
                    }}
                  >
                    {position !== 'negative' && (
                      <br-container
                        id="positive-values"
                        height={this.direction === 'vertical' ? positivePercentage : '100%'}
                        width={this.direction === 'vertical' ? '100%' : positivePercentage}
                        direction={
                          (this.direction === 'vertical' && this.stacked) ||
                          (this.direction === 'horizontal' && !this.stacked)
                            ? 'column'
                            : 'row'
                        }
                        directionAlignment={this.direction === 'vertical' ? 'end' : 'start'}
                        secondaryAlignment={this.direction === 'vertical' ? 'end' : 'start'}
                      >
                        {this.data.map((series) => {
                          const value = series.data[group];
                          const maxReference = Math.abs(maxToUse);
                          const pointReference = value < 0 ? 0 : Math.abs(series.data[group]);
                          const isHovered =
                            !this.hoveredElement ||
                            (this.hoveredElement &&
                              this.hoveredElement.point === group &&
                              !this.hoveredElement.series &&
                              !this.hoveredElement.value) ||
                            (this.hoveredElement.point === group &&
                              this.hoveredElement.series === series.name &&
                              this.hoveredElement.value === series.data[group]);
                          return (
                            <br-container
                              key={`sparkline-bar-${group}-${series.name}-${value}`}
                              id={`sparkline-bar-${group}-${series.name}-${value}`}
                              class={{ 'br-sparkline-bar-inert': value < 0 }}
                              backgroundColor={
                                series.backgroundColor
                                  ? {
                                      color: series.backgroundColor.color,
                                      opacity: isHovered
                                        ? (`${Number(series.backgroundColor.opacity || 1)}` as GenericZeroToOne)
                                        : (`${Number(series.backgroundColor.opacity || 1) / 2}` as GenericZeroToOne),
                                    }
                                  : {
                                      color: 'Primary',
                                      opacity: isHovered ? '1' : '0.5',
                                    }
                              }
                              style={{
                                pointerEvents: value < 0 ? 'none' : 'auto',
                              }}
                              shrink={true}
                              height={
                                this.direction === 'vertical'
                                  ? `calc(100% * ${pointReference / maxReference})`
                                  : height
                              }
                              width={
                                this.direction === 'horizontal'
                                  ? `calc(100% * ${pointReference / maxReference})`
                                  : width
                              }
                              onMouseOver={(e) => {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                this.hoveredElement = {
                                  point: group,
                                  series: series.name,
                                  value: series.data[group],
                                };
                              }}
                            />
                          );
                        })}
                      </br-container>
                    )}
                    {position !== 'positive' && (
                      <br-container
                        id="negative-values"
                        height={this.direction === 'vertical' ? negativePercentage : '100%'}
                        width={this.direction === 'vertical' ? '100%' : negativePercentage}
                        direction={
                          (this.direction === 'vertical' && this.stacked) ||
                          (this.direction === 'horizontal' && !this.stacked)
                            ? 'column'
                            : 'row'
                        }
                        directionAlignment={this.direction === 'vertical' ? 'start' : 'end'}
                        secondaryAlignment={this.direction === 'vertical' ? 'start' : 'end'}
                      >
                        {this.data.map((series) => {
                          const value = series.data[group];
                          const maxReference = Math.abs(minToUse);
                          const pointReference = value > 0 ? 0 : Math.abs(series.data[group]);
                          const isHovered =
                            !this.hoveredElement ||
                            (this.hoveredElement &&
                              this.hoveredElement.point === group &&
                              !this.hoveredElement.series &&
                              !this.hoveredElement.value) ||
                            (this.hoveredElement.point === group &&
                              this.hoveredElement.series === series.name &&
                              this.hoveredElement.value === series.data[group]);
                          return (
                            <br-container
                              key={`sparkline-bar-${group}-${series.name}-${value}`}
                              id={`sparkline-bar-${group}-${series.name}-${value}`}
                              class={{ 'br-sparkline-bar-inert': value > 0 }}
                              backgroundColor={
                                series.backgroundColor
                                  ? {
                                      color: series.backgroundColor.color,
                                      opacity: isHovered
                                        ? (`${Number(series.backgroundColor.opacity || 1)}` as GenericZeroToOne)
                                        : (`${Number(series.backgroundColor.opacity || 1) / 2}` as GenericZeroToOne),
                                    }
                                  : {
                                      color: 'Primary',
                                      opacity: isHovered ? '1' : '0.5',
                                    }
                              }
                              style={{
                                pointerEvents: value > 0 ? 'none' : 'auto',
                              }}
                              shrink={true}
                              height={
                                this.direction === 'vertical'
                                  ? `calc(100% * ${pointReference / maxReference})`
                                  : height
                              }
                              width={
                                this.direction === 'horizontal'
                                  ? `calc(100% * ${pointReference / maxReference})`
                                  : width
                              }
                              onMouseOver={(e) => {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                this.hoveredElement = {
                                  point: group,
                                  series: series.name,
                                  value: series.data[group],
                                };
                              }}
                            />
                          );
                        })}
                      </br-container>
                    )}
                  </br-container>
                </br-container>
              );
            })}
          </Fragment>
        );
      }
      if (this.type === 'line') {
        const renderLine = (series: HTMLBrSparklineDataElement, index: number) => {
          const data = series.data;
          if (!data || data.length < 2) return null;
          const strokeColor = series.backgroundColor || { color: 'Primary', opacity: 1 };
          const colorValue = strokeColor.color;
          const shadeNames = getAllUniqueShadeNames();
          const appliedShadeName = shadeNames.find((shade) => colorValue?.includes(shade));
          const colorObject =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Colors[this.theme] as any)[colorValue] || (Colors[ThemeDefault] as any)[colorValue];

          const colorHex = appliedShadeName
            ? colorObject[appliedShadeName]
            : colorObject[ColorShadeNameDefault] || colorObject;

          const xScale = (i: number) => (i / (data.length - 1)) * 100;
          const yScale = (d: number) => (Math.abs(d - minToUse) / absSize) * 100;

          const pathD = data
            .map((d, i) => {
              let previousValue = 0;
              if (index !== 0 && this.stacked) {
                previousValue = this.data
                  .filter((_d, ix) => ix <= index - 1)
                  .map((_d) => _d.data[i])
                  .reduce((a, b) => a + b, 0);
              }
              const x = this.direction === 'horizontal' ? xScale(i) : yScale(d + previousValue);
              const y =
                this.direction === 'horizontal' ? 100 - yScale(d + previousValue) : 100 - xScale(i);
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            })
            .join(' ');
          return (
            <path
              d={pathD}
              fill="none"
              stroke={colorHex}
              opacity={'1'}
              stroke-width={'2'}
              vector-effect="non-scaling-stroke"
              style={{
                pointerEvents: 'none',
              }}
            />
          );
        };

        return (
          <svg
            style={{
              pointerEvents: 'all',
            }}
            id="svg-line-content"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            onMouseLeave={() => {
              this.hoveredElement = undefined;
            }}
            onMouseMove={(e) => {
              const whichPointFromMouse = (e: MouseEvent) => {
                const rect = this.elm.shadowRoot
                  ?.getElementById('sparkline-content')
                  ?.getBoundingClientRect();
                if (!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const point = this.direction === 'horizontal' ? x : y;
                const totalPoints = this.data[0].data.length;
                const pointWidth =
                  this.direction === 'horizontal'
                    ? rect.width / totalPoints
                    : rect.height / totalPoints;
                const closestPoint = Math.floor(point / pointWidth);
                return closestPoint;
              };
              const point = whichPointFromMouse(e);

              if (point !== undefined) {
                this.hoveredElement = {
                  ...(this.hoveredElement || {}),
                  point,
                };
              }
            }}
          >
            {this.data.map((series, i) => renderLine(series, i))}
          </svg>
        );
      }
    };

    const hoveredColor = (series: string) =>
      series ? this.data.find((d) => d.name === series)?.backgroundColor : undefined;
    const hoveredElementData =
      this.hoveredElement &&
      ((this.hoveredElement.series &&
        this.hoveredElement.value && [
          {
            series: this.hoveredElement.series,
            value: this.hoveredElement.value,
          },
        ]) ||
        this.data.map((d) => ({
          series: d.name,
          value: (this.type === 'line' && this.direction === 'vertical'
            ? [...d.data].reverse()
            : d.data)[this.hoveredElement!.point],
        })));
    const getTooltipPosition = (point: number, length: number) => {
      if (point < 0) return 0;
      if (point === 0) return 0;
      if (point === length - 1) return 100;
      return Math.min(100, Math.max(0, point * (100 / (length - 1))));
    };
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        {this.showTooltip && (
          <br-tooltip
            theme={this.theme}
            interaction="click"
            placement={
              (this.direction === 'vertical' && this.type !== 'line') ||
              (this.direction === 'horizontal' && this.type === 'line')
                ? 'top'
                : 'right'
            }
            ref={(ref) => (this.tooltipRef = ref)}
          >
            <br-tooltip-content theme={this.theme}>
              <br-container
                theme={this.theme}
                direction="column"
                directionAlignment="start"
                secondaryAlignment="center"
                verticalGap="calc(var(--size-unit) * 2)"
                style={{
                  pointerEvents: 'none',
                }}
              >
                {hoveredElementData?.map((d) => {
                  return (
                    <br-container
                      theme={this.theme}
                      key={`${d.series}-${d.value}`}
                      direction="row"
                      fullWidth={true}
                      horizontalGap="calc(var(--size-unit) * 4)"
                      directionAlignment="space-between"
                      secondaryAlignment="center"
                    >
                      <br-container
                        theme={this.theme}
                        direction="row"
                        horizontalGap="calc(var(--size-unit) * 2)"
                        directionAlignment="start"
                        secondaryAlignment="center"
                      >
                        <br-container
                          theme={this.theme}
                          backgroundColor={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            color: hoveredColor(d.series)?.color as any,
                            opacity: hoveredColor(d.series)?.opacity || '1',
                          }}
                          width="calc(var(--size-unit) * 3)"
                          height="calc(var(--size-unit) * 3)"
                          borderRadius={{
                            topLeft: `var(--actionable-element-border-radius-x-small)`,
                            topRight: `var(--actionable-element-border-radius-x-small)`,
                            bottomRight: `var(--actionable-element-border-radius-x-small)`,
                            bottomLeft: `var(--actionable-element-border-radius-x-small)`,
                          }}
                        />
                        <span
                          style={{
                            color: 'inherit',
                            fontWeight: 'bold',
                            fontSize: 'var(--actionable-element-font-size-small)',
                          }}
                        >
                          {d.series}
                        </span>
                      </br-container>
                      <span
                        style={{
                          color: 'inherit',
                          fontSize: 'var(--actionable-element-font-size-small)',
                        }}
                      >
                        {this.formatValue(d.value, this.hoveredElement?.point)}
                      </span>
                    </br-container>
                  );
                })}
              </br-container>
            </br-tooltip-content>
          </br-tooltip>
        )}
        <br-container
          id="sparkline-content"
          fullHeight={true}
          fullWidth={true}
          shrink={true}
          horizontalGap={this.showGap ? '2px' : undefined}
          verticalGap={this.showGap ? '2px' : undefined}
          direction={this.direction === 'vertical' ? 'row' : 'column'}
          style={{
            pointerEvents: 'none',
          }}
        >
          {this.type === 'line' ? (
            <br-container
              id="sparkline-hover-line"
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: '1',
                left:
                  this.direction === 'horizontal'
                    ? getTooltipPosition(
                        this.hoveredElement?.point || 0,
                        this.data[0].data.length,
                      ) + '%'
                    : '0',
                top:
                  this.direction === 'vertical'
                    ? getTooltipPosition(
                        this.hoveredElement?.point || 0,
                        this.data[0].data.length,
                      ) + '%'
                    : '0',
                transform:
                  this.direction === 'horizontal' ? 'translateX(-50%)' : 'translateY(-50%)',
              }}
              width={this.direction === 'horizontal' ? '2px' : '100%'}
              height={this.direction === 'horizontal' ? '100%' : '2px'}
              backgroundColor={{
                color: this.theme === 'Light' ? 'Primary' : 'Primary-100',
                opacity: '0.5',
              }}
              opacity={!this.hoveredElement ? '0' : '1'}
              shrink={true}
            />
          ) : null}
          {renderTypes()}
        </br-container>
      </Host>
    );
  }
}

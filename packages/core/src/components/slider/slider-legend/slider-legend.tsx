import { Component, Host, Prop, State, h } from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { Element } from '@stencil/core';
import { DebugMode } from '../../debug/types/utils';

/**
 * The Slider legend displays values on the slider.
 * @category Inputs & Forms
 * @parent slider
 * @slot {{value}}-tick-content - Dynamic slot name that allows passing custom rendered content to each tag input element.
 */
@Component({
  tag: 'br-slider-legend',
  styleUrl: './css/slider-legend.css',
  shadow: true,
})
export class SliderLegend {
  /**
   * A mutation observer to monitor the changes in content.
   */
  private resizeObserver: ResizeObserver | undefined;
  /**
   * A mutation observer to monitor the changes in content.
   */
  private tickResizeObserver: ResizeObserver | undefined;
  /**
   * A reference to the parent slider.
   */
  private parentSliderRef: HTMLBrSliderElement | null;
  /**
   * A reference to the slider thumb element.
   */
  @Element() elm: HTMLBrSliderLegendElement;
  /**
   * The number of elements to display in the legend.
   */
  @State() legendArray: Array<number> = [];
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines specific step to interval use for the label display.
   * @category Appearance
   */
  @Prop() labelStep?: number;
  /**
   * Defines the prefix applied to the label.
   * @category Appearance
   */
  @Prop() labelPrefix?: string;
  /**
   * Defines the suffix applied to the label.
   * @category Appearance
   */
  @Prop() labelSuffix?: string;
  /**
   * Defines whether the min and max values are displayed.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showMinAndMax: boolean = true;

  componentWillLoad() {
    this.parentSliderRef = this.elm.closest('br-slider');
    if (!this.parentSliderRef && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This slider thumb is not nested in a slider.`, this.elm);
    }
    this.resizeObserver = new ResizeObserver(this.getValuesFromStep);
    this.tickResizeObserver = new ResizeObserver(this.getValuesFromStep);
  }

  componentDidLoad() {
    this.resizeObserver?.observe(this.elm);
    const tick = this.elm.shadowRoot?.querySelector('.br-slider-legend-tick-zero');
    if (!tick) {
      return;
    }
    this.tickResizeObserver?.observe(tick);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.tickResizeObserver?.disconnect();
    this.tickResizeObserver = undefined;
  }

  private getMaximumLabels = (
    min: number,
    max: number,
    step: number,
    labelStep: number,
    width: number,
    labelWidth: number,
  ) => {
    // Generate all potential slider values based on the slider step
    const sliderValues = [];
    for (let value = min; value <= max; value += step) {
      sliderValues.push(value);
    }

    // Filter the slider values to include only those that match the label step
    const labels = [min]; // Ensure min is always included
    for (let value = min + labelStep; value < max; value += labelStep) {
      if (sliderValues.includes(value)) {
        labels.push(value);
      }
    }
    labels.push(max); // Ensure max is always included

    // Calculate the maximum number of labels that can fit in the slider's width
    const maxLabels = Math.floor(width / labelWidth);

    // Adjust the labels if they exceed the maximum allowed
    if (labels.length > maxLabels) {
      const adjustedLabels = [min];
      const stepBetweenLabels = Math.ceil((labels.length - 2) / (maxLabels - 2));

      for (let i = 1; i < labels.length - 1; i += stepBetweenLabels) {
        adjustedLabels.push(labels[i]);
      }

      adjustedLabels.push(max);
      return adjustedLabels;
    }

    return labels;
  };

  private getValuesFromStep = () => {
    if (!this.parentSliderRef) {
      return [];
    }
    const step = this.parentSliderRef.step;
    const min = this.parentSliderRef.min;
    const max = this.parentSliderRef.max;
    const isVertical = this.parentSliderRef.orientation === 'vertical';
    const width = isVertical
      ? this.elm.getBoundingClientRect().height
      : this.elm.getBoundingClientRect().width;
    const wrapper = this.elm.shadowRoot?.querySelector('.br-slider-legend-tick-zero');
    if (!wrapper) {
      return [];
    }
    const maxLength = wrapper.getBoundingClientRect().width;
    const steps: number[] = this.getMaximumLabels(
      min,
      max,
      this.labelStep || step,
      step,
      width,
      maxLength,
    );
    this.legendArray = [...steps];
  };

  private shouldHideMinAndMax = () => {
    if (!this.parentSliderRef) {
      return false;
    }
    const isFirstlabelAfterMinOrAfterMax =
      (this.legendArray[1] ===
        (this.labelStep || this.parentSliderRef.step) + this.parentSliderRef.min &&
        this.legendArray[2] !==
          (this.labelStep || this.parentSliderRef.step) * 2 + this.parentSliderRef.min) ||
      (this.legendArray[this.legendArray.length - 2] ===
        this.parentSliderRef.max - (this.labelStep || this.parentSliderRef.step) &&
        this.legendArray[this.legendArray.length - 3] !==
          this.parentSliderRef.max - (this.labelStep || this.parentSliderRef.step) * 2);
    return isFirstlabelAfterMinOrAfterMax;
  };

  render() {
    return (
      <Host>
        <div class="br-slider-legend-wrapper">
          <div class="br-slider-legend-tick-zero">
            {this.labelPrefix}
            {this.parentSliderRef?.max}
            {this.labelSuffix}
          </div>
          {this.legendArray.map((l) => {
            // const percentagePosition = (i / (this.legendArray.length - 1)) * 100;
            const min = this.parentSliderRef?.min || 0;
            const max = this.parentSliderRef?.max || 0;

            const positiveLimit = max - min;
            const negativeStartingPoint = max + Math.abs(min);
            const negativeLimit = Math.abs(min - max);
            const startsNegativeOrNot = min < 0 && max >= 0 ? negativeStartingPoint : negativeLimit;
            const valueRange = min >= 0 && max >= 0 ? positiveLimit : startsNegativeOrNot;

            const lPercentage = ((l - min) / valueRange) * 100;

            const position =
              this.parentSliderRef?.orientation === 'vertical'
                ? { bottom: `${lPercentage}%` }
                : { left: `${lPercentage}%` };
            const isMinOrMax = l === this.parentSliderRef?.min || l === this.parentSliderRef?.max;
            return (
              <span
                style={{
                  ...position,
                  opacity:
                    isMinOrMax && (!this.showMinAndMax || this.shouldHideMinAndMax()) ? '0' : '1',
                }}
                class="br-slider-legend-tick"
                key={l}
              >
                <slot name={`${l}-tick-content`}>
                  <span>
                    {this.labelPrefix}
                    {l}
                    {this.labelSuffix}
                  </span>
                </slot>
                <slot name={`${l}-tick-symbol-content`}>
                  <div class="br-slider-legend-tick-symbol"></div>
                </slot>
              </span>
            );
          })}
        </div>
      </Host>
    );
  }
}

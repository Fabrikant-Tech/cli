import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { calculatePositionFromValue } from './utils/utils';
import { Placement } from '@floating-ui/dom';
import { isEqual } from 'lodash-es';
import { DebugMode } from '../../debug/types/utils';

// This id increments for all inputs on the page
let sliderThumbId = 0;

/**
 * Used with the slider, the Slider Thumb component is what users move along the slider track to select a value, multiple values, or a range of values, depending on the props.
 *
 * @category Inputs & Forms
 * @parent slider
 * @slot label - Passes a custom label for the thumb.
 */
@Component({
  tag: 'br-slider-thumb',
  styleUrl: './css/slider-thumb.css',
  shadow: { delegatesFocus: true },
})
export class SliderThumb {
  /**
   * A reference to the slider thumb.
   */
  private thumbRef: HTMLDivElement | undefined;
  /**
   * A reference to the parent slider.
   */
  private parentSliderRef: HTMLBrSliderElement | null;
  /**
   * A reference to the slider thumb element.
   */
  @Element() elm: HTMLBrSliderThumbElement;
  /**
   * Whether the thumb is being dragged.
   */
  @State() isBeingDragged: boolean = false;
  /**
   * Whether the thumb is focused.
   */
  @State() isFocused: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-slider-thumb-${sliderThumbId++}`;
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: number;
  @Watch('value')
  handleValueChanged(newValue: number, oldValue: number) {
    calculatePositionFromValue(this.parentSliderRef, newValue);
    const parentSliderValue = this.parentSliderRef?.value;

    if (!this.parentSliderRef) {
      return;
    }

    const valueInSliderValue = parentSliderValue
      ? Object.entries(parentSliderValue).find(([key]) => key === this.rangeName)
      : undefined;

    const actualValue =
      (valueInSliderValue && this.position === 'max' && valueInSliderValue[1]) ||
      (valueInSliderValue && this.position === 'min' && valueInSliderValue[1]) ||
      (valueInSliderValue &&
        !this.position &&
        !Array.isArray(valueInSliderValue) &&
        valueInSliderValue) ||
      undefined;

    if (!isEqual(newValue, oldValue) && !isEqual(newValue, actualValue)) {
      this.valueChange.emit({ value: newValue });
    }
  }
  /**
   * Defines the name of the range the component is associated with.
   * @category Data
   * @visibility persistent
   */
  @Prop() rangeName!: string;
  /**
   * Defines the position of the thumb.
   * @category Data
   * @visibility persistent
   */
  @Prop() position!: 'min' | 'max';
  /**
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min!: number;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max!: number;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines if the tooltips are persistent.
   * @category Appearance
   */
  @Prop() persistentTooltip?: boolean = false;
  /**
   * Determines the position of the tooltip relative to the component.
   * @category Appearance
   */
  @Prop() tooltipPosition?: Placement;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: number }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{ value: number }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  @Event({ cancelable: true }) input!: EventEmitter<{ value: number }>;
  /**
   * A method to move the thumb to a given position.
   */
  @Method()
  async moveToCoordinate(coordinate: number) {
    if (!this.parentSliderRef?.disabled) {
      const position = coordinate;
      const value = this.calculateValue(position);
      const clampedValue = this.clampValue(value || 0);
      this.value = clampedValue;
      return this.thumbRef?.focus({ preventScroll: true });
    }
  }

  componentWillLoad() {
    this.parentSliderRef = this.elm.closest('br-slider');
    if (!this.parentSliderRef && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This slider thumb is not nested in a slider.`, this.elm);
    }
  }

  private getThumbsFromParent = () => {
    if (!this.parentSliderRef) {
      return [];
    }
    const thumbs = Array.from(this.parentSliderRef.querySelectorAll('br-slider-thumb'));
    return thumbs;
  };

  private getMinAndMax = () => {
    if (!this.parentSliderRef) return { min: 0, max: 0 };

    const thumbs = this.getThumbsFromParent();
    const step = this.parentSliderRef.step;
    let min = this.min || this.parentSliderRef.min;
    let max = this.max || this.parentSliderRef.max;

    if (!thumbs || thumbs.length === 0) return { min, max };

    const thumbIndex = thumbs.findIndex(
      (t) => t.rangeName === this.rangeName && t.position === this.position,
    );
    const pairedThumb = thumbs.find(
      (t) => t.rangeName === this.rangeName && t.position !== this.position,
    );
    const hasPair = !!pairedThumb;
    const noSiblings = thumbs.length === 1;

    if (noSiblings) {
      return { min, max };
    }

    if (hasPair && thumbIndex >= 0) {
      const pairedIndex = thumbs.findIndex((t) => t === pairedThumb);
      const isPairImmediate = Math.abs(thumbIndex - pairedIndex) === 1;

      if (isPairImmediate) {
        min =
          thumbIndex > pairedIndex
            ? pairedThumb.value + step
            : Math.max(thumbs[thumbIndex - 1]?.value + step || this.parentSliderRef.min, min);

        max =
          thumbIndex > pairedIndex
            ? Math.min(thumbs[thumbIndex + 1]?.value - step || this.parentSliderRef.max, max)
            : pairedThumb.value - step;
      } else {
        min = Math.max(thumbs[thumbIndex - 1]?.value + step || this.parentSliderRef.min, min);
        max = Math.min(thumbs[thumbIndex + 1]?.value - step || this.parentSliderRef.max, max);
      }
    } else {
      min = thumbs[thumbIndex - 1]?.value + step || min;
      max = thumbs[thumbIndex + 1]?.value - step || max;
    }

    return { min, max };
  };

  private clampValue = (value: number) => {
    if (!this.parentSliderRef) {
      return 0;
    }
    const limits = this.getMinAndMax();
    let clampedValue: number;
    if (limits.min <= value && value <= limits.max) {
      clampedValue = value;
    } else {
      clampedValue = value > limits.max ? limits.max : limits.min;
    }
    const decimals =
      this.parentSliderRef.step && this.parentSliderRef.step.toString().split('.')[1]
        ? this.parentSliderRef.step.toString().split('.')[1].length
        : 0;
    return Number(Number(clampedValue).toFixed(decimals));
  };

  private calculateValueForStep = (value: number, isNotExact?: boolean) => {
    let stepValue = this.clampValue(value);
    if (this.parentSliderRef?.step !== undefined) {
      const exactDelta = 0;
      const positiveSliderMin =
        this.parentSliderRef.min > 0
          ? Math.max(this.parentSliderRef.min - this.parentSliderRef.step, 0)
          : undefined;
      const negativeValueCalc =
        value < 0
          ? Math.max(
              Math.abs(this.parentSliderRef.min) - this.parentSliderRef.step,
              this.parentSliderRef.step,
            )
          : this.parentSliderRef.step - Math.abs(this.parentSliderRef.min);
      const inexactDelta = positiveSliderMin !== undefined ? positiveSliderMin : negativeValueCalc;
      const delta = isNotExact ? inexactDelta : exactDelta;
      const steppedValue =
        delta + Math.floor(stepValue / this.parentSliderRef.step) * this.parentSliderRef.step;
      stepValue = this.clampValue(steppedValue);
    }
    return stepValue;
  };

  private calculateValue = (position: number) => {
    if (!this.parentSliderRef) {
      return 0;
    }
    const { min, max } = this.parentSliderRef;
    const validRange = max - min;
    const boxTarget = this.parentSliderRef?.shadowRoot?.querySelector('.br-slider-control-wrapper');
    if (!boxTarget) {
      return 0;
    }
    const box = boxTarget.getBoundingClientRect();
    const initialPosition =
      this.parentSliderRef?.orientation === 'vertical' ? box.bottom : box.left;
    const size = this.parentSliderRef?.orientation === 'vertical' ? box.height : box.width;
    const p =
      this.parentSliderRef?.orientation === 'vertical'
        ? (initialPosition - position) / size
        : (position - initialPosition) / size;
    const belowHalf = p <= 50 ? min + validRange * p : validRange * p - max;
    const valueCalc = min > 0 ? min + validRange * p : belowHalf;
    let value = this.clampValue(valueCalc);
    if (this.parentSliderRef.step) {
      const minIsExact = min % this.parentSliderRef.step === 0;
      if (minIsExact) {
        value = this.calculateValueForStep(value);
      } else {
        value = this.calculateValueForStep(value, !minIsExact);
      }
    }
    return value;
  };

  private handleThumbDrag = async (e: MouseEvent) => {
    if (!this.parentSliderRef?.disabled) {
      e.preventDefault();
      e.stopPropagation();
      const position = this.parentSliderRef?.orientation === 'vertical' ? e.clientY : e.clientX;
      const value = this.calculateValue(position);
      const clampedValue = this.clampValue(value || 0);
      this.value = clampedValue;
      this.thumbRef?.focus({ preventScroll: true });
    }
  };

  private handleStartThumbDrag = () => {
    if (!this.parentSliderRef?.disabled) {
      this.isBeingDragged = true;
      this.addListeners();
    }
  };

  private handleStopThumbDrag = () => {
    if (!this.parentSliderRef?.disabled) {
      this.removeListeners();
      this.isBeingDragged = false;
    }
  };

  private addListeners = () => {
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', this.handleThumbDrag);
    document.addEventListener('mouseup', this.handleStopThumbDrag);
  };

  private removeListeners = () => {
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', this.handleThumbDrag);
    document.removeEventListener('mouseup', this.handleStopThumbDrag);
  };

  private handleKeyDown = async (e: KeyboardEvent) => {
    if (!this.parentSliderRef) {
      return;
    }
    if (!this.parentSliderRef.disabled) {
      const key = e.key;
      if (
        key === 'ArrowDown' ||
        key === 'ArrowUp' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        key === 'PageUp' ||
        key === 'PageDown' ||
        key === 'Home' ||
        key === 'End'
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if ((!e.shiftKey && key === 'ArrowDown') || (!e.shiftKey && key === 'ArrowLeft')) {
          this.value = this.clampValue(this.value - this.parentSliderRef.step);
        }
        if ((!e.shiftKey && key === 'ArrowUp') || (!e.shiftKey && key === 'ArrowRight')) {
          this.value = this.clampValue(this.value + this.parentSliderRef.step);
        }
        if (
          (e.shiftKey && key === 'ArrowDown') ||
          (e.shiftKey && key === 'ArrowLeft') ||
          key === 'PageDown'
        ) {
          this.value = this.clampValue(this.value - this.parentSliderRef.largeStep);
        }
        if (
          (e.shiftKey && key === 'ArrowUp') ||
          (e.shiftKey && key === 'ArrowRight') ||
          key === 'PageUp'
        ) {
          this.value = this.clampValue(this.value + this.parentSliderRef.largeStep);
        }
        if (key === 'Home') {
          this.value = this.getMinAndMax().min;
        }
        if (key === 'End') {
          this.value = this.getMinAndMax().max;
        }
      }
    }
  };

  private handleThumbFocus = () => {
    const isFocusVisible = this.thumbRef?.matches(':focus-visible');
    if (!isFocusVisible) {
      return;
    }
    this.isFocused = true;
  };

  private handleThumbBlur = () => {
    this.isFocused = false;
  };

  render() {
    const styleObject =
      this.parentSliderRef?.orientation === 'vertical'
        ? { bottom: `${calculatePositionFromValue(this.parentSliderRef, this.value || 0)}%` }
        : { left: `${calculatePositionFromValue(this.parentSliderRef, this.value || 0)}%` };
    const hasLegend = this.parentSliderRef?.querySelector('br-slider-legend');
    const horizontalTooltipPosition = hasLegend ? 'bottom' : 'top';
    return (
      <Host
        style={styleObject}
        role="slider"
        aria-valuemin={this.min}
        aria-valuemax={this.max}
        aria-valuenow={this.value}
        onMouseDown={this.handleStartThumbDrag}
        onMouseUp={this.handleStopThumbDrag}
        onKeyDown={this.handleKeyDown}
      >
        <br-tooltip
          portalDestination="inline"
          showArrow={false}
          theme={this.theme}
          isOpen={this.persistentTooltip || this.isBeingDragged || this.isFocused}
          placement={
            this.tooltipPosition ||
            (this.parentSliderRef?.orientation === 'vertical' ? 'right' : horizontalTooltipPosition)
          }
        >
          <div
            ref={(ref) => (this.thumbRef = ref)}
            tabindex={!this.disabled ? 0 : -1}
            slot="target"
            class={{
              'br-slider-thumb-wrapper': true,
              'br-slider-thumb-disabled': true,
            }}
            onFocus={this.handleThumbFocus}
            onBlur={this.handleThumbBlur}
          >
            <slot></slot>
          </div>
          <br-tooltip-content theme={this.theme} class="br-slider-thumb-tooltip">
            <slot name="label">
              <span>{this.value}</span>
            </slot>
          </br-tooltip-content>
        </br-tooltip>
      </Host>
    );
  }
}

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  Host,
  Method,
  Prop,
  Watch,
  h,
} from '@stencil/core';
import { BaseColorType } from '../../reserved/editor-types';
import { ColorType, FillStyle, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { isEqual } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

const hours24 = [...Array(24).keys()];
const hours12 = [...Array(13).keys()];
const minutes = [...Array(60).keys()];
const seconds = [...Array(60).keys()];
const milliseconds = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * The Time Picker component is a flexible time widget. Often used with the time input component, it enables users to select a time.
 * @category Date & Time
 * @slot {{type}}-{{v}}-content - Dynamic slot name that allows passing content to each individual button in the picker.
 * @slot me-am-content - Passes content to the am meridiem button if present.
 * @slot me-pm-content - Passes content to the pm meridiem button if present.
 */
@Component({
  tag: 'br-time-picker',
  styleUrl: './css/time-picker.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class TimePicker {
  private hoursRef: HTMLBrScrollAreaElement | undefined;
  private minutesRef: HTMLBrScrollAreaElement | undefined;
  private secondsRef: HTMLBrScrollAreaElement | undefined;
  private millisecondsRef: HTMLBrScrollAreaElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTimePickerElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the time format of the component.
   * @category Data
   */
  @Prop() format: 24 | 12 = 12;
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: Date | undefined = undefined;
  @Watch('value')
  handleValueChange(newValue: Date | undefined, oldValue: Date | undefined) {
    if (!isEqual(newValue, oldValue)) {
      this.scrollToActiveTime();
      this.valueChange.emit({ value: newValue });
      this.internals?.setFormValue(newValue?.toUTCString() || '');
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?: Date;
  /**
   * Defines the name associated with this component in the context of a form.
   * @category Data
   */
  @Prop({ reflect: true }) name: string;
  /**
   * Determines the precision of the component selection.
   * @category Data
   * @visibility persistent
   */
  @Prop() precision: 'hour' | 'minute' | 'second' | 'millisecond' = 'minute';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Determines whether an affordance for selecting the current date and time with the set precision.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showNowButton: boolean = true;
  /**
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min?: Date;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max?: Date;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: Date | undefined }>;
  /**
   * Method to scroll to the currently selected value;
   */
  @Method()
  async scrollToCurrentValue() {
    this.scrollToActiveTime();
  }
  /**
   * A method to clear the value of the picker
   */
  @Method()
  async clearValue(): Promise<void> {
    this.value = undefined;
    this.internals?.setFormValue(null);
  }

  private internalFocusOverride = (options?: FocusOptions): void => {
    (this.elm.shadowRoot?.querySelector('br-button[active]') as HTMLBrButtonElement)?.focus({
      preventScroll: true,
      ...(options || {}),
    });
  };

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  componentWillLoad() {
    if (this.value !== undefined) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error(
          `WARNING - This input is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
          this.elm,
        );
      }
      this.internals?.setFormValue(this.value !== undefined ? this.value.toUTCString() : '');
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      this.internals?.setFormValue(this.defaultValue.toUTCString() || '');
    }
  }

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
    this.scrollToActiveTime();
  }

  private scrollToActiveTime = () => {
    const scrollToElement = (ref: HTMLBrScrollAreaElement | undefined, elementId: string) => {
      const activeElement = this.elm.shadowRoot?.getElementById(elementId);
      const buttonSize = (
        this.elm.shadowRoot?.querySelector('br-button[id*="h-"]') as HTMLBrButtonElement
      )?.offsetHeight;
      const buttonOffset = buttonSize * 1.75;

      if (!activeElement || !ref) {
        return;
      }
      ref.scrollTo({
        top:
          (activeElement.offsetTop > ref.offsetTop
            ? activeElement.offsetTop - ref.offsetTop
            : ref.offsetTop - activeElement.offsetTop) - buttonOffset,
        behavior: 'smooth',
      });
    };

    const hour = this.format === 24 ? this.value?.getHours() : (this.value?.getHours() || 1) % 12;
    scrollToElement(this.hoursRef, `h-${hour}`);
    scrollToElement(this.minutesRef, `m-${this.value?.getMinutes()}`);
    scrollToElement(this.secondsRef, `s-${this.value?.getSeconds()}`);
    scrollToElement(this.millisecondsRef, `ms-${this.value?.getMilliseconds()}`);
  };

  private setCurrentTime = () => {
    const today = new Date();
    const values = [
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
      today.getMilliseconds(),
    ];
    const sliceIndex =
      (this.precision === 'hour' && 0) ??
      ((this.precision === 'minute' && 1) ||
        (this.precision === 'second' && 2) ||
        (this.precision === 'millisecond' && 3));
    const sliced = values.slice(0, sliceIndex || -1);
    this.value = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      sliced[0] || 0,
      sliced[1] || 0,
      sliced[2] || 0,
      sliced[3] || 0,
    );
  };

  private getDateForAm = (localDate?: Date) => {
    const today = new Date();
    const newHour = localDate?.getHours() || 0;
    const hourToApply = newHour >= 12 ? newHour - 12 : newHour;
    return new Date(
      (localDate || today).getFullYear(),
      (localDate || today).getMonth(),
      (localDate || today).getDate(),
      hourToApply,
      localDate?.getMinutes() || 0,
      localDate?.getSeconds() || 0,
      localDate?.getMilliseconds() || 0,
    );
  };

  private getDateForPm = (localDate?: Date) => {
    const today = new Date();
    const newHour = localDate?.getHours() || 0;
    const hourToApply = newHour <= 11 ? newHour + 12 : newHour;
    return new Date(
      (localDate || today).getFullYear(),
      (localDate || today).getMonth(),
      (localDate || today).getDate(),
      hourToApply,
      localDate?.getMinutes() || 0,
      localDate?.getSeconds() || 0,
      localDate?.getMilliseconds() || 0,
    );
  };

  private isBetweenDates = (valueToCheck: Date) => {
    const min = this.min;
    const max = this.max;
    const isAboveMax = max ? valueToCheck > max : false;
    const isBelowMin = min ? valueToCheck < min : false;
    return !isAboveMax && !isBelowMin;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }
    const getNextSiblingOfType = (
      element: Element,
      tagName: string,
      direction: 'forward' | 'backward',
    ) => {
      let next =
        direction === 'forward' ? element.nextElementSibling : element.previousElementSibling; // Start with the next element

      while (next) {
        if (next.tagName.toLowerCase() === tagName.toLowerCase()) {
          return next;
        }
        next = direction === 'forward' ? next.nextElementSibling : next.previousElementSibling; // Move to the next sibling
      }

      return null;
    };
    const key = e.key;
    if (key === 'ArrowUp') {
      e.preventDefault();
      const previousSibling = this.elm.shadowRoot?.activeElement?.previousElementSibling;
      if (previousSibling) {
        (previousSibling as HTMLElement).focus();
      }
    }
    if (key === 'ArrowDown') {
      e.preventDefault();
      const previousSibling = this.elm.shadowRoot?.activeElement?.nextElementSibling;
      if (previousSibling) {
        (previousSibling as HTMLElement).focus();
      }
    }
    if (key === 'ArrowLeft' || (key === 'Tab' && e.shiftKey)) {
      const parentElement = this.elm.shadowRoot?.activeElement?.parentElement;
      if (!parentElement) {
        return;
      }
      const previousScrollElement = getNextSiblingOfType(
        parentElement,
        'br-scroll-area',
        'backward',
      );
      if (previousScrollElement) {
        e.preventDefault();
        const firstActiveButton =
          previousScrollElement.querySelector('br-button[active]') ||
          previousScrollElement.querySelector('br-button');
        if (firstActiveButton) {
          (firstActiveButton as HTMLBrButtonElement).focus();
        }
      }
    }
    if (key === 'ArrowRight' || (key === 'Tab' && !e.shiftKey)) {
      const parentElement = this.elm.shadowRoot?.activeElement?.parentElement;
      if (!parentElement) {
        return;
      }
      const nextScrollElement = getNextSiblingOfType(parentElement, 'br-scroll-area', 'forward');
      if (nextScrollElement) {
        e.preventDefault();
        const firstActiveButton =
          nextScrollElement.querySelector('br-button[active]') ||
          nextScrollElement.querySelector('br-button');
        if (firstActiveButton) {
          (firstActiveButton as HTMLBrButtonElement).focus();
        }
      }
    }
  };

  render() {
    const localDate = this.value
      ? new Date(
          this.value.getFullYear(),
          this.value.getMonth(),
          this.value.getDate(),
          this.value.getHours(),
          this.value.getMinutes(),
          this.value.getSeconds(),
          this.value.getMilliseconds(),
        )
      : undefined;
    const hours = this.format === 24 ? hours24 : hours12;

    const amPmHours = localDate ? localDate.getHours() % 12 : undefined;

    const amPmHourValue = (this.format === 24 && undefined) || amPmHours;

    const amPm =
      (localDate && localDate.getHours() >= 12 && 'PM') ||
      (localDate && localDate.getHours() < 12 && 'AM') ||
      undefined;

    const buttonProps: {
      fillStyle: FillStyle;
      size: Size;
      colorType: BaseColorType<ColorType>;
      class: string;
      theme: Theme;
    } = {
      fillStyle: 'Ghost',
      size: this.size,
      colorType: 'Neutral',
      class: 'br-time-picker-value-button',
      theme: this.theme,
    };

    const renderFiller = () => {
      return <div class="br-time-picker-filler-space" inert={true} />;
    };

    const renderSeparator = () => {
      return <div class="br-time-picker-separator" />;
    };

    const scrollAreaProps: object = {
      class: 'br-display-flex-column br-display-flex br-timer-picker-parts',
      overscrollY: 'contain',
      scrollSnapType: 'both mandatory',
      theme: this.theme,
    };

    const hasMinute = this.precision !== 'hour';
    const hasSecond = this.precision !== 'minute' && hasMinute;
    const hasMillisecond = this.precision !== 'second' && hasSecond;

    const renderPickerBlock = (
      values: number[],
      type: 'h' | 'm' | 's' | 'ms',
      active: (v: number) => boolean,
      label: (v: number) => string,
      valueToSet: (v: number) => Date,
    ) => {
      return (
        <Fragment>
          {values.map((v) => {
            return (
              <br-button
                id={`${type}-${v}`}
                key={`${type}-${v}`}
                disabled={!this.isBetweenDates(valueToSet(v)) || this.disabled}
                active={active(v)}
                {...buttonProps}
                colorType={active(v) ? 'Primary' : buttonProps.colorType}
                onClick={() => {
                  this.value = valueToSet(v);
                }}
              >
                <slot slot="left-icon" name={`${type}-${v}-content`}>
                  <span slot="left-icon">{label(v)}</span>
                </slot>
              </br-button>
            );
          })}
          {renderFiller()}
        </Fragment>
      );
    };
    return (
      <Host onKeyDown={this.handleKeyDown}>
        <div class="br-time-picker-selectors-wrapper">
          <br-scroll-area ref={(ref) => (this.hoursRef = ref)} {...scrollAreaProps}>
            {renderPickerBlock(
              this.format === 24 ? hours : [12, ...hours.filter((hr) => hr !== 12 && hr !== 0)],
              'h',
              (v) => {
                const hour = v;
                return (
                  (this.format === 24 ? hour === localDate?.getHours() : undefined) ||
                  (hour === 12 ? 0 === amPmHourValue : hour === amPmHourValue)
                );
              },
              (v) => {
                const hour = v;
                return `${hour.toString().length === 1 ? '0' : ''}${hour}`;
              },
              (v) => {
                const hour = v;
                const hourToSet =
                  (this.format === 24 ? hour : undefined) ??
                  (amPm === 'AM' && hour === 12 ? 0 : undefined) ??
                  (amPm === 'PM' && hour !== 12 ? hour + 12 : undefined) ??
                  hour;
                const today = new Date();
                return new Date(
                  (localDate || today).getFullYear(),
                  (localDate || today).getMonth(),
                  (localDate || today).getDate(),
                  hourToSet,
                  localDate?.getMinutes() || 0,
                  localDate?.getSeconds() || 0,
                  localDate?.getMilliseconds() || 0,
                );
              },
            )}
          </br-scroll-area>
          {hasMinute && renderSeparator()}
          {hasMinute && (
            <br-scroll-area ref={(ref) => (this.minutesRef = ref)} {...scrollAreaProps}>
              {renderPickerBlock(
                minutes,
                'm',
                (v) => {
                  return v === localDate?.getMinutes();
                },
                (v) => {
                  return `${v.toString().length === 1 ? '0' : ''}${v}`;
                },
                (v) => {
                  const today = new Date();
                  return new Date(
                    (localDate || today).getFullYear(),
                    (localDate || today).getMonth(),
                    (localDate || today).getDate(),
                    localDate?.getHours() || 0,
                    v,
                    localDate?.getSeconds() || 0,
                    localDate?.getMilliseconds() || 0,
                  );
                },
              )}
            </br-scroll-area>
          )}
          {hasSecond && renderSeparator()}
          {hasSecond && (
            <br-scroll-area ref={(ref) => (this.secondsRef = ref)} {...scrollAreaProps}>
              {renderPickerBlock(
                seconds,
                's',
                (v) => {
                  return v === localDate?.getSeconds();
                },
                (v) => {
                  return `${v.toString().length === 1 ? '0' : ''}${v}`;
                },
                (v) => {
                  const today = new Date();
                  return new Date(
                    (localDate || today).getFullYear(),
                    (localDate || today).getMonth(),
                    (localDate || today).getDate(),
                    localDate?.getHours() || 0,
                    localDate?.getMinutes() || 0,
                    v,
                    localDate?.getMilliseconds() || 0,
                  );
                },
              )}
            </br-scroll-area>
          )}
          {hasMillisecond && renderSeparator()}
          {hasMillisecond && (
            <br-scroll-area ref={(ref) => (this.millisecondsRef = ref)} {...scrollAreaProps}>
              {renderPickerBlock(
                milliseconds,
                'ms',
                (v) => {
                  return v === localDate?.getMilliseconds();
                },
                (v) => {
                  return `${v === 0 ? '00' : ''}${v}`;
                },
                (v) => {
                  const today = new Date();
                  return new Date(
                    (localDate || today).getFullYear(),
                    (localDate || today).getMonth(),
                    (localDate || today).getDate(),
                    localDate?.getHours() || 0,
                    localDate?.getMinutes() || 0,
                    localDate?.getSeconds() || 0,
                    v,
                  );
                },
              )}
            </br-scroll-area>
          )}
          {this.format !== 24 && renderSeparator()}
          {this.format !== 24 && (
            <br-scroll-area {...scrollAreaProps} allowedScroll={false}>
              <br-button
                {...buttonProps}
                active={amPm === 'AM'}
                colorType={amPm === 'AM' ? 'Primary' : buttonProps.colorType}
                onClick={() => {
                  const dateToApply = this.getDateForAm(localDate);
                  this.value = this.isBetweenDates(dateToApply) ? dateToApply : this.min;
                }}
              >
                <slot slot="left-icon" name={'me-am-content'}>
                  <span slot="left-icon">AM</span>
                </slot>
              </br-button>
              <br-button
                {...buttonProps}
                active={amPm === 'PM'}
                colorType={amPm === 'PM' ? 'Primary' : buttonProps.colorType}
                onClick={() => {
                  const dateToApply = this.getDateForPm(localDate);
                  this.value = this.isBetweenDates(dateToApply) ? dateToApply : this.max;
                }}
              >
                <slot slot="left-icon" name={'me-pm-content'}>
                  <span slot="left-icon">PM</span>
                </slot>
              </br-button>
            </br-scroll-area>
          )}
        </div>
        {this.showNowButton && (
          <Fragment>
            <div class="br-time-picker-separator horizontal" />
            <div class="br-time-picker-now-button-container">
              <br-button
                fillStyle="Ghost"
                fullWidth={true}
                size={this.size}
                colorType="Neutral"
                onClick={this.setCurrentTime}
                theme={this.theme}
              >
                <span>Now</span>
              </br-button>
            </div>
          </Fragment>
        )}
      </Host>
    );
  }
}

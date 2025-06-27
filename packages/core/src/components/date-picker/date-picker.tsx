import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import {
  clampDate,
  cleanUpDates,
  getAllDatesBetween,
  getMonthNames,
  getShortMonthNames,
  getShortDayNames,
  getYearsBetweenYears,
  isDateBetween,
  isMonthInRange,
  getMonthsBetween,
  isToday,
  isNow,
} from '../../utils/date-time/date-time-utils';
import {
  generateCalendarDays,
  getSelectionDirectionsForDay,
  isDaySelected,
  getSelectionDirectionsForMonth,
} from './utils/utils';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { isEqual } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

const DATE_YEAR_THRESHOLD = 5;
const today = new Date();
const defaultMaxDate = new Date(
  today.getFullYear() + DATE_YEAR_THRESHOLD,
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0,
  0,
);
const defaultMinDate = new Date(
  today.getFullYear() - DATE_YEAR_THRESHOLD,
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0,
  0,
);

/**
 * The Date Picker component is a flexible calendar widget. Often used with the date input component, it enables users to select a single date, a date range, or multiple dates, depending on its props.
 * @category Date & Time
 * @slot {{year}}-{{month}}-content - Dynamic slot name that allows passing content to the buttons representing the months when precision is set to month.
 * @slot {{year}}-{{month}}-{{date}}-content - Dynamic slot name that allows passing content to the buttons representing the days when precision is not month.
 * @slot week-{{week}}-content - Dynamic slot name that allows passing content to the number representing the week.
 */
@Component({
  tag: 'br-date-picker',
  styleUrl: './css/date-picker.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class DatePicker {
  /**
   * A referenec to the internal time picker.
   */
  private timePickerRef: HTMLBrTimePickerElement | undefined;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDatePickerElement;
  /**
   * Stores the previous view state to determine the animation direction.
   */
  @State() previousView: Date;
  /**
   * The current days in view.
   */
  @State() daysInView: {
    date: number;
    month: number;
    year: number;
    dayOfWeek: number;
    weekNumber: number;
  }[] = [];
  /**
   * The selected value for the time.
   */
  @State() timeValue: Date | undefined;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the precision of the component selection.
   * @category Data
   * @visibility persistent
   */
  @Prop({ reflect: true }) precision:
    | 'month'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'millisecond' = 'day';
  /**
   * Defines the time format of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() format: 24 | 12 = 12;
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: Date[] | undefined = undefined;
  @Watch('value')
  handleValueChanged(newValue: Date[] | undefined, oldValue: Date[] | undefined) {
    const formData = new FormData();
    if (!isEqual(newValue, oldValue)) {
      newValue?.map((d) => {
        formData.append(this.name, d.toISOString());
      });
      this.timeValue = this.value ? this.value[0] : undefined;
      const newValueToApply = newValue !== undefined ? formData : null;
      this.internals?.setFormValue(newValueToApply);
      this.valueChange.emit({ value: newValue });
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?: Date[];
  /**
   * The current view state.
   */
  @Prop({ mutable: true }) currentView: Date;
  @Watch('currentView')
  currentViewChanged(newValue: Date, oldValue: Date) {
    if (!isEqual(newValue, oldValue)) {
      this.previousView = oldValue;
      this.currentViewChange.emit({ value: newValue });
      this.setDaysForView(newValue);
    }
  }
  /**
   * Determines the default view the component opens on.
   * @category Data
   */
  @Prop() defaultView?: Date;
  /**
   * Defines the name associated with this component in the context of a form.
   * @category Data
   */
  @Prop({ reflect: true }) name: string;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Determines which day of the week is presented as the first day in the component.
   * @category Appearance
   */
  @Prop() firstCalendarDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;
  /**
   * Defines the locale of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() locale: string = 'en-US';
  /**
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min: Date = defaultMinDate;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: Date = defaultMaxDate;
  /**
   * Determines if the days of the previous and next month should be displayed in the component.
   * @category Appearance
   */
  @Prop() showFillDays: boolean = false;
  /**
   * Determines if the height of the component is kept consistent regardless of the number of items displayed.
   * @category Appearance
   */
  @Prop({ reflect: true }) variableHeight: boolean = false;
  /**
   * Determines if a week number is also displayed.
   * @category Appearance
   */
  @Prop({ reflect: true }) showWeekNumber: boolean = false;
  /**
   * Determines the selection allowed by the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() selection: 'single' | 'multiple' | 'range' = 'single';
  /**
   * Determines if a previously selected value is deselected when the user selects it again.
   * @category Behavior
   */
  @Prop() selectingSameValueDeselects: boolean = true;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Determines if the component highlights the current date when in view.
   * @category Appearance
   */
  @Prop() highlightToday: boolean = true;
  /**
   * Determines whether an affordance for selecting the current date and time with the set precision.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showNowButton: boolean = true;
  /**
   * Determines whether an affordance for selecting the current date with the set precision.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showTodayButton: boolean = true;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: Date[] | undefined }>;
  /**
   * Emits an event whenever the current view changes.
   */
  @Event({ cancelable: true }) currentViewChange!: EventEmitter<{ value: Date }>;
  /**
   * A method to clear the value of the picker
   */
  @Method()
  async clearValue(): Promise<void> {
    this.value = undefined;
    this.internals?.setFormValue(null);
  }
  /**
   * Method to set the current view of the date picker.;
   */
  @Method()
  async setCurrentView(date: Date) {
    this.currentView = date;
  }
  /**
   * Method to scroll to the currently selected value;
   */
  @Method()
  async scrollToCurrentValue() {
    if (this.timePickerRef) {
      this.timePickerRef.scrollToCurrentValue();
    }
  }

  private internalFocusOverride = (options?: FocusOptions): void => {
    this.focusAppropriateItem('none', options || {});
  };

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  componentWillLoad() {
    if (this.value !== undefined) {
      const clampedValue = cleanUpDates(this.value, this.min, this.max, this.elm);
      if (clampedValue.length !== this.value.length) {
        this.value = clampedValue;
      }
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error(
          `WARNING - This date picker is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
          this.elm,
        );
      }
      if (!this.defaultView) {
        this.currentView = this.value[this.value.length - 1];
      }
      const formData = new FormData();
      this.value?.map((d) => {
        formData.append(this.name, d.toISOString());
      });
      this.timeValue = this.value[0];
      this.internals?.setFormValue(formData);
    }
    if (this.defaultValue) {
      const clampedValue = cleanUpDates(this.defaultValue, this.min, this.max, this.elm);
      if (clampedValue.length !== this.defaultValue.length) {
        this.value = clampedValue;
      }
      this.currentView = this.defaultValue[this.defaultValue.length - 1];
      this.timeValue = this.defaultValue[0];
      const formData = new FormData();
      this.defaultValue.map((d) => {
        formData.append(this.name, d.toISOString());
      });
      this.internals?.setFormValue(formData);
    }
    const today = new Date();
    if (!this.value && !this.defaultView) {
      this.currentView = clampDate(today, this.min, this.max, this.elm);
    }
    if (this.defaultView) {
      this.currentView = clampDate(this.defaultView, this.min, this.max, this.elm);
    }
    this.setDaysForView(this.currentView);
  }

  componentDidLoad() {
    this.elm.focus = () => this.internalFocusOverride();
  }

  private setDaysForView = (value: Date) => {
    const month = value.getMonth();
    const year = value.getFullYear();
    const days = generateCalendarDays(year, month, this.firstCalendarDay);
    this.daysInView = days;
  };

  private handleValueClearOnClickOutside = (e: globalThis.Event) => {
    const isContained =
      this.elm.contains(e.target as globalThis.Element) ||
      this.elm.shadowRoot?.contains(e.target as globalThis.Element);
    if (!isContained) {
      this.value = undefined;
      window.removeEventListener('click', this.handleValueClearOnClickOutside);
    }
  };

  private handleDaySelection = (
    day: {
      date: number;
      month: number;
      year: number;
      dayOfWeek: number;
    },
    selected: boolean,
  ) => {
    const timeValue =
      this.timeValue || (this.value && this.value[0]) || new Date(1970, 0, 1, 0, 0, 0, 0);
    const newDate = new Date(
      day.year,
      day.month,
      day.date,
      timeValue.getHours(),
      timeValue.getMinutes(),
      timeValue.getSeconds(),
      timeValue.getMilliseconds(),
    );
    const dateToSet = clampDate(newDate, this.min, this.max, this.elm);
    if (this.selection === 'range') {
      window.removeEventListener('click', this.handleValueClearOnClickOutside);
      const hasTwoValues = this.value && this.value.length === 2;
      if (hasTwoValues || !this.value) {
        this.value = [dateToSet];
        window.addEventListener('click', this.handleValueClearOnClickOutside);
      } else {
        this.value =
          this.value![0] > dateToSet ? [dateToSet, this.value![0]] : [this.value![0], dateToSet];
        window.removeEventListener('click', this.handleValueClearOnClickOutside);
      }
    } else if (this.selection === 'single') {
      const shouldUnset = selected && this.selectingSameValueDeselects;
      this.value = shouldUnset ? undefined : [dateToSet];
    } else {
      const shouldUnset = selected && this.selectingSameValueDeselects;
      const valueForSelection =
        selected && !this.selectingSameValueDeselects
          ? [...(this.value || [])]
          : [...(this.value || []), dateToSet];
      this.value = shouldUnset
        ? this.value?.filter((v) => !isEqual(v, dateToSet))
        : valueForSelection;
    }
  };

  private handleCycle = (direction: 'backward' | 'forward') => {
    if (this.precision !== 'month') {
      const newDate = new Date(
        this.currentView.getFullYear(),
        this.currentView.getMonth() + (direction === 'backward' ? -1 : 1),
        this.currentView.getDate(),
      );
      this.currentView = clampDate(newDate, this.min, this.max, this.elm);
    } else {
      const newDate = new Date(
        this.currentView.getFullYear() + (direction === 'backward' ? -1 : 1),
        this.currentView.getMonth(),
        this.currentView.getDate(),
      );
      this.currentView = clampDate(newDate, this.min, this.max, this.elm);
    }
  };

  private adjustTimeForDates = (timeDate: Date) => {
    if (!this.value) {
      return;
    }
    const applyTimeToSingleValue = (value: Date) => {
      const valueToApply = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
        timeDate.getHours(),
        timeDate.getMinutes(),
        timeDate.getSeconds(),
        timeDate.getMilliseconds(),
      );
      return valueToApply;
    };
    const newValue = this.value.map((v) => applyTimeToSingleValue(v));
    this.value = newValue;
  };

  private handleTimeValueChange = (e: CustomEvent<{ value: Date | undefined }>) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (e.detail.value) {
      this.adjustTimeForDates(e.detail.value);
    }
  };

  private setToday = () => {
    const today = new Date();
    const timeValue =
      this.timeValue || (this.value && this.value[0]) || new Date(1970, 0, 1, 0, 0, 0, 0);
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      timeValue.getHours(),
      timeValue.getMinutes(),
      timeValue.getSeconds(),
      timeValue.getMilliseconds(),
    );
    if (!isToday(this.currentView)) {
      this.currentView = today;
    }
    this.value = [date];
  };

  private setCurrentTime = () => {
    const today = new Date();
    if (!isToday(this.currentView)) {
      this.currentView = today;
    }
    this.value = [today];
  };

  private getRow = (itemButton: HTMLBrButtonElement | null) => {
    if (!itemButton?.classList.contains('br-date-picker-calendar-day-button')) {
      return -1;
    }
    const allButtons = this.elm.shadowRoot?.querySelectorAll('.br-date-picker-calendar-day-button');
    if (!allButtons) {
      return -1;
    }
    const index = Array.from(allButtons).indexOf(itemButton);
    const count = this.precision === 'month' ? 3 : 7;
    return Math.floor(index / count);
  };

  private elementsOnRow = (row: number) => {
    const allButtons = this.elm.shadowRoot?.querySelectorAll('.br-date-picker-calendar-day-button');
    if (!allButtons) {
      return;
    }
    return Array.from(allButtons).filter((b) => {
      const buttonRow = this.getRow(b as HTMLBrButtonElement);
      return buttonRow === row;
    });
  };

  private getPreviousRow = (row: number): HTMLBrButtonElement[] | undefined => {
    const elementsOnRow = this.elementsOnRow(row) as HTMLBrButtonElement[] | null;
    if (!elementsOnRow || elementsOnRow.length === 0) {
      return undefined;
    }
    const hasActiveElement = elementsOnRow?.find(
      (element) =>
        element.getAttribute('disabled') === null || element.getAttribute('disabled') === 'false',
    ) as HTMLBrButtonElement | null;
    if (!hasActiveElement) {
      return this.getPreviousRow(row - 1);
    } else {
      return elementsOnRow;
    }
  };

  private focusAppropriateItem = (
    direction: 'none' | 'nextItem' | 'previousItem' | 'nextRow' | 'previousRow',
    options?: FocusOptions,
  ) => {
    const activeElement = this.elm.shadowRoot?.activeElement as HTMLBrButtonElement | null;
    const row = this.getRow(activeElement as HTMLBrButtonElement);

    if (direction === 'none') {
      const days = this.elm.shadowRoot?.querySelectorAll(
        '.br-date-picker-calendar-day-button-visible:not([disabled])',
      );
      if (days && days.length > 0) {
        (
          Array.from(days).find(
            (d) => d.getAttribute('disabled') === null || d.getAttribute('disabled') === 'false',
          ) as HTMLBrButtonElement | null
        )?.focus(options);
      }
    }

    const elementsOnRow = this.elementsOnRow(row);
    const index = elementsOnRow?.findIndex((b) => b === (activeElement as HTMLBrButtonElement));
    const firstActiveElement = elementsOnRow?.find(
      (element) =>
        element.getAttribute('disabled') === null || element.getAttribute('disabled') === 'false',
    ) as HTMLBrButtonElement | null;
    const lastActiveElement = elementsOnRow
      ?.reverse()
      .find(
        (element) =>
          element.getAttribute('disabled') === null || element.getAttribute('disabled') === 'false',
      ) as HTMLBrButtonElement | null;
    const isFirstOnRow = firstActiveElement === activeElement && elementsOnRow;
    const isLastOnRow = lastActiveElement === activeElement;
    const isNotMin = this.currentView > this.min;
    const isNotMax = this.currentView < this.max;
    if (
      (isLastOnRow && direction === 'nextItem' && isNotMax) ||
      (isFirstOnRow && direction === 'previousItem' && isNotMin)
    ) {
      this.handleCycle(direction === 'nextItem' ? 'forward' : 'backward');
      setTimeout(() => {
        const newRow = this.elementsOnRow(row) as HTMLBrButtonElement[] | undefined;
        const previousActivatableRow = this.getPreviousRow(row - 1);

        if (!newRow && !previousActivatableRow) {
          return;
        }
        const whichElementRow = newRow && newRow.length > 0 ? newRow : previousActivatableRow || [];

        const dayButtonsForView = this.elm.shadowRoot?.querySelectorAll(
          '.br-date-picker-calendar-day-button-visible:not([disabled])',
        );

        const firstSelectableDay = Array.from(dayButtonsForView || []).find(
          (b) => b.getAttribute('disabled') === null || b.getAttribute('disabled') === 'false',
        ) as HTMLBrButtonElement | null;
        const lastSelectableDay = Array.from(dayButtonsForView || [])
          .reverse()
          .find(
            (b) => b.getAttribute('disabled') === null || b.getAttribute('disabled') === 'false',
          ) as HTMLBrButtonElement | null;

        if (direction === 'previousItem') {
          const element = (whichElementRow || [])
            .reverse()
            .find(
              (e) => e.getAttribute('disabled') === null || e.getAttribute('disabled') === 'false',
            );
          (element || lastSelectableDay)?.focus(options);
        }
        if (direction === 'nextItem') {
          const element = (whichElementRow || []).find(
            (e) => e.getAttribute('disabled') === null || e.getAttribute('disabled') === 'false',
          );
          (element || firstSelectableDay)?.focus(options);
        }
      }, 150);
    } else {
      if (direction === 'nextItem' || direction === 'previousItem') {
        const whichElement =
          direction === 'nextItem'
            ? (activeElement?.nextElementSibling as HTMLBrButtonElement | null)
            : (activeElement?.previousElementSibling as HTMLBrButtonElement | null);
        if (
          whichElement &&
          (whichElement.getAttribute('disabled') === null ||
            whichElement.getAttribute('disabled') === 'false')
        ) {
          whichElement?.focus(options);
        }
      }
      if (direction === 'nextRow' || direction === 'previousRow') {
        const nextRow = this.elementsOnRow(row + 1) as HTMLBrButtonElement[] | undefined;
        const previousRow = this.elementsOnRow(row - 1) as HTMLBrButtonElement[] | undefined;
        if (direction === 'previousRow') {
          const element = (previousRow || []).find((p, i) => {
            if (i === index) {
              return p;
            }
          });
          element?.focus(options);
        }
        if (direction === 'nextRow') {
          const element = (nextRow || []).find((p, i) => {
            if (i === index) {
              return p;
            }
          });
          element?.focus(options);
        }
      }
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.focusAppropriateItem('previousItem');
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.focusAppropriateItem('nextItem');
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusAppropriateItem('previousRow');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusAppropriateItem('nextRow');
    }
    const dayButtons = this.elm.shadowRoot?.querySelectorAll('.br-date-picker-calendar-day-button');
    if (e.key === 'Tab' && !e.shiftKey) {
      if (this.precision === 'month' || this.precision === 'day') {
        const activeElement = this.elm.shadowRoot?.activeElement as HTMLBrButtonElement | null;
        const lastFocusableElement = Array.from(dayButtons || [])
          ?.reverse()
          .find(
            (b) => b.getAttribute('disabled') === null || b.getAttribute('disabled') === 'false',
          ) as HTMLBrButtonElement | null;
        if (
          activeElement !== lastFocusableElement &&
          activeElement?.classList.contains('br-date-picker-calendar-day-button')
        ) {
          e.preventDefault();
          lastFocusableElement?.focus();
        }
      } else {
        if (
          this.elm.shadowRoot?.activeElement?.classList.contains(
            'br-date-picker-calendar-day-button',
          )
        ) {
          e.preventDefault();
          this.timePickerRef?.focus();
        }
      }
    }
    if (e.key === 'Tab' && e.shiftKey) {
      const firstFocusableElement = Array.from(dayButtons || [])?.find(
        (b) => b.getAttribute('disabled') === null || b.getAttribute('disabled') === 'false',
      ) as HTMLBrButtonElement | null;
      if (
        this.elm.shadowRoot?.activeElement?.classList.contains('br-date-picker-calendar-day-button')
      ) {
        if (this.elm.shadowRoot?.activeElement !== firstFocusableElement) {
          e.preventDefault();
          firstFocusableElement?.focus();
        }
      }
    }
  };

  render() {
    const renderMonthItemButton = (item: { label: string; monthNumber: number }) => {
      const date = new Date(this.currentView.getFullYear(), item.monthNumber, 1);
      const selected = isDaySelected(date, this.value);
      const isInSelectedRange =
        this.value &&
        this.selection === 'range' &&
        isDateBetween(date, this.value[0], this.value[1]);

      const valueToCheck =
        this.selection === 'range' && this.value && this.value.length === 2
          ? getMonthsBetween(this.value[0], this.value[1]).map(
              (d) => new Date(d.year, d.monthNumber, 1),
            )
          : this.value;
      const classnames =
        valueToCheck && this.selection !== 'single'
          ? getSelectionDirectionsForMonth(
              {
                monthNumber: item.monthNumber,
                year: this.currentView.getFullYear(),
              },
              valueToCheck,
            )
              .map((t) => {
                return `br-has-selected-${t}`;
              })
              .join(' ')
          : '';
      const isInRange = isDateBetween(date, this.min, this.max);
      const isDisabled = !isInRange;
      const today = new Date();
      const markedAsToday =
        isToday(new Date(date.getFullYear(), date.getMonth(), today.getDate())) &&
        this.highlightToday;
      return (
        <br-button
          key={`${item.label}`}
          width={'33.33%'}
          disabled={isDisabled || this.disabled}
          size={this.size}
          fillStyle="Ghost"
          colorType={selected || isInSelectedRange ? 'Primary' : 'Neutral'}
          active={selected || isInSelectedRange}
          onClick={() =>
            this.handleDaySelection(
              {
                date: date.getDate(),
                dayOfWeek: 0,
                month: item.monthNumber,
                year: this.currentView.getFullYear(),
              },
              selected,
            )
          }
          theme={this.theme}
          class={{
            'br-date-picker-calendar-day-button': true,
            'br-date-picker-calendar-day-button-visible': !isDisabled,
            'br-date-picker-today-marker': markedAsToday,
            [`${classnames}`]: true,
          }}
        >
          <slot name={`${this.currentView.getFullYear()}-${item.label}-content`}>
            <span>{item.label}</span>
          </slot>
        </br-button>
      );
    };

    const renderDayItemButton = (item: {
      date: number;
      month: number;
      year: number;
      dayOfWeek: number;
      weekNumber: number;
    }) => {
      const date = new Date(item.year, item.month, item.date);
      const selected = isDaySelected(date, this.value);
      const isInRange = isDateBetween(
        date,
        new Date(this.min.getFullYear(), this.min.getMonth(), this.min.getDate()),
        new Date(this.max.getFullYear(), this.max.getMonth(), this.max.getDate()),
        true,
      );
      const isCurrentMonth = item.month === this.currentView.getMonth();
      const isDisabled =
        !isInRange || !(this.showFillDays || (!this.showFillDays && isCurrentMonth));
      const opacity =
        (isCurrentMonth ? 1 : undefined) ||
        ((!this.showFillDays ? 0 : undefined) ??
          (this.showFillDays && !isCurrentMonth ? 0.75 : undefined));
      const isInSelectedRange =
        this.value &&
        this.selection === 'range' &&
        isDateBetween(date, this.value[0], this.value[1]);
      const valueToCheck =
        this.selection === 'range' && this.value && this.value.length === 2
          ? getAllDatesBetween(this.value[0], this.value[1])
          : this.value;
      const classnames =
        valueToCheck && this.selection !== 'single'
          ? getSelectionDirectionsForDay(item, this.daysInView, valueToCheck)
              .map((t) => {
                return `br-has-selected-${t}`;
              })
              .join(' ')
          : '';
      const markedAsToday = isToday(date) && this.highlightToday;
      return (
        <br-button
          key={`${item.date}-${item.month}-${item.year}`}
          disabled={isDisabled || this.disabled}
          data-day-of-week={item.dayOfWeek}
          data-month={item.month}
          data-year={item.year}
          id={`${isInRange ? 'in range' : 'out-of-range'}`}
          size={this.size}
          fillStyle="Ghost"
          square={true}
          colorType={selected || isInSelectedRange ? 'Primary' : 'Neutral'}
          active={selected || isInSelectedRange}
          onClick={() => this.handleDaySelection(item, selected)}
          theme={this.theme}
          class={{
            'br-date-picker-calendar-day-button': true,
            'br-date-picker-today-marker': markedAsToday,
            'br-date-picker-calendar-day-button-visible': opacity !== 0,
            [`${classnames}`]: true,
          }}
          style={{
            opacity: `${opacity}`,
            pointerEvents: opacity === 0 ? 'none' : 'all',
          }}
        >
          <slot name={`${item.year}-${item.month}-${item.date}-content`}>
            <span>{item.date}</span>
          </slot>
        </br-button>
      );
    };

    const renderYearSelector = (years: number[], currentYear: number[]) => {
      return (
        <br-single-select
          theme={this.theme}
          required={true}
          value={currentYear}
          onValueChange={(e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            const timeValue =
              this.timeValue || (this.value && this.value[0]) || new Date(1970, 0, 1, 0, 0, 0, 0);
            const newDate = new Date(
              Number(e.detail.value![0]),
              this.currentView.getMonth(),
              this.currentView.getDate(),
              timeValue.getHours(),
              timeValue.getMinutes(),
              timeValue.getSeconds(),
              timeValue.getMilliseconds(),
            );
            this.currentView = clampDate(newDate, this.min, this.max, this.elm);
          }}
          selectingSameValueDeselects={false}
        >
          <br-popover
            theme={this.theme}
            onClose={(e) => {
              e.stopImmediatePropagation();
              e.stopPropagation();
            }}
          >
            <br-button
              fillStyle="Ghost"
              colorType="Neutral"
              size={this.size}
              alignContentToMargins={true}
              slot="target"
              theme={this.theme}
              disabled={this.disabled}
            >
              <br-single-select-value />
            </br-button>
            <br-popover-content theme={this.theme}>
              <br-select-list fullWidth={true} theme={this.theme} size={this.size}>
                {years.map((y) => {
                  return (
                    <br-select-list-item
                      key={y}
                      fullWidth={true}
                      theme={this.theme}
                      value={y}
                      size={this.size !== 'Large' ? this.size : 'Normal'}
                    >
                      <span>{y}</span>
                    </br-select-list-item>
                  );
                })}
              </br-select-list>
            </br-popover-content>
          </br-popover>
        </br-single-select>
      );
    };

    const renderMonthSelector = (months: string[], currentMonth: string[]) => {
      return (
        <br-single-select
          theme={this.theme}
          required={true}
          value={currentMonth}
          onValueChange={(e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            const timeValue =
              this.timeValue || (this.value && this.value[0]) || new Date(1970, 0, 1, 0, 0, 0, 0);
            const newDate = new Date(
              this.currentView.getFullYear(),
              months.findIndex((m) => m === e.detail.value![0]),
              this.currentView.getDate(),
              timeValue.getHours(),
              timeValue.getMinutes(),
              timeValue.getSeconds(),
              timeValue.getMilliseconds(),
            );
            this.currentView = newDate;
          }}
          selectingSameValueDeselects={false}
        >
          <br-popover
            theme={this.theme}
            onClose={(e) => {
              e.stopImmediatePropagation();
              e.stopPropagation();
            }}
          >
            <br-button
              fillStyle="Ghost"
              colorType="Neutral"
              size={this.size}
              alignContentToMargins={true}
              slot="target"
              theme={this.theme}
              ellipsis={true}
              disabled={this.disabled}
            >
              <br-single-select-value />
            </br-button>
            <br-popover-content theme={this.theme}>
              <br-select-list
                fullWidth={true}
                theme={this.theme}
                size={this.size !== 'Large' ? this.size : 'Normal'}
              >
                {months.map((m) => {
                  const year = this.currentView.getFullYear();
                  const isInRange = isMonthInRange(
                    months.findIndex((mo) => mo === m),
                    year,
                    this.min,
                    this.max,
                  );
                  return (
                    <br-select-list-item
                      size={this.size}
                      key={m}
                      fullWidth={true}
                      theme={this.theme}
                      value={m}
                      disabled={!isInRange}
                    >
                      <span>{m}</span>
                    </br-select-list-item>
                  );
                })}
              </br-select-list>
            </br-popover-content>
          </br-popover>
        </br-single-select>
      );
    };

    const renderYearMonthSelectors = () => {
      const months = getMonthNames(this.locale);
      const currentMonth = [months[this.currentView.getMonth()]];
      const currentYear = [this.currentView.getFullYear()];
      const years = getYearsBetweenYears(this.min.getFullYear(), this.max.getFullYear(), true);
      const hideMonth = this.precision === 'month';
      const previousMonthDate = new Date(
        this.currentView.getFullYear(),
        this.currentView.getMonth() - 1,
        this.currentView.getDate(),
      );
      const nextMonthDate = new Date(
        this.currentView.getFullYear(),
        this.currentView.getMonth() + 1,
        this.currentView.getDate(),
      );
      const previousYearDate = new Date(
        this.currentView.getFullYear() - 1,
        this.currentView.getMonth(),
        this.currentView.getDate(),
      );
      const nextYearDate = new Date(
        this.currentView.getFullYear() + 1,
        this.currentView.getMonth(),
        this.currentView.getDate(),
      );
      const isPreviousScreenInRange =
        this.precision !== 'month'
          ? isDateBetween(previousMonthDate, this.min, this.max)
          : isDateBetween(previousYearDate, this.min, this.max);
      const isNextScreenInRange =
        this.precision !== 'month'
          ? isDateBetween(nextMonthDate, this.min, this.max)
          : isDateBetween(nextYearDate, this.min, this.max);
      return (
        <div class="br-date-picker-header-selectors">
          <br-button
            fillStyle="Ghost"
            colorType="Neutral"
            size={this.size}
            disabled={!isPreviousScreenInRange || this.disabled}
            onClick={() => this.handleCycle('backward')}
            theme={this.theme}
          >
            <br-icon slot="left-icon" iconName="ChevronLeft" />
          </br-button>
          <div>
            {!hideMonth && renderMonthSelector(months, currentMonth)}
            {renderYearSelector(years, currentYear)}
          </div>
          <br-button
            fillStyle="Ghost"
            colorType="Neutral"
            size={this.size}
            onClick={() => this.handleCycle('forward')}
            disabled={!isNextScreenInRange || this.disabled}
            theme={this.theme}
          >
            <br-icon slot="left-icon" iconName="ChevronRight" />
          </br-button>
        </div>
      );
    };

    const renderWeekCount = () => {
      const groupedDays = () => {
        const grouped = [];
        for (let i = 0; i < this.daysInView.length; i += 7) {
          grouped.push(this.daysInView.slice(i, i + 7));
        }
        return grouped;
      };
      const firstDayInCurrentMonth = () => {
        const groupedFirstDay = groupedDays().map((d) => {
          return d.find((day) => day.dayOfWeek === 1);
        });
        return groupedFirstDay;
      };
      const weekNumbers = firstDayInCurrentMonth().map((d) => d?.weekNumber);
      return weekNumbers.map((w) => {
        return (
          <br-button
            key={`w-${w}`}
            disabled={true}
            size={this.size}
            fillStyle="Ghost"
            square={true}
            colorType={'Neutral'}
            theme={this.theme}
          >
            <slot name={`week-${w}-content`}>
              <span class="br-date-picker-week-count">{w}</span>
            </slot>
          </br-button>
        );
      });
    };

    const renderPrecision = () => {
      const weekdays = getShortDayNames(this.locale, this.firstCalendarDay);
      return (
        <Fragment>
          <div
            class="br-date-picker-header"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {renderYearMonthSelectors()}
            {this.precision !== 'month' && (
              <div class="br-date-picker-header-days">
                {this.showWeekNumber && <span>#</span>}
                {weekdays.map((w) => {
                  return <span key={w}>{w.charAt(0).toUpperCase()}</span>;
                })}
              </div>
            )}
          </div>
          {/* Add a container here for the week number */}
          {this.precision === 'month' && (
            <div
              key={JSON.stringify(this.currentView)}
              class={{
                'br-date-picker-calendar-day-wrapper': true,
                'br-date-picker-enter-right': this.previousView < this.currentView,
                'br-date-picker-enter-left': this.previousView > this.currentView,
                'br-date-picker-no-animation': this.previousView === undefined,
              }}
            >
              {getShortMonthNames(this.locale).map((m, i) =>
                renderMonthItemButton({ monthNumber: i, label: m }),
              )}
            </div>
          )}
          {this.precision !== 'month' && (
            <div
              key={JSON.stringify(this.currentView)}
              class={{
                'br-date-picker-calendar': true,
                'br-date-picker-enter-right': this.previousView < this.currentView,
                'br-date-picker-enter-left': this.previousView > this.currentView,
                'br-date-picker-no-animation': this.previousView === undefined,
              }}
            >
              {this.showWeekNumber && (
                <div class="br-date-picker-calendar-weeks" style={{ minHeight: '32px' }}>
                  {renderWeekCount()}
                </div>
              )}
              <div class="br-date-picker-calendar-day-wrapper">
                {this.daysInView.map((d) => renderDayItemButton(d))}
              </div>
            </div>
          )}
        </Fragment>
      );
    };

    const renderSeparator = () => {
      return <div class="br-date-picker-separator" />;
    };

    return (
      <Host onKeyDown={this.handleKeyDown}>
        <div class="br-date-picker-root-wrapper">
          <div
            class="br-date-picker-precision-wrapper"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {renderPrecision()}
          </div>
          {this.precision !== 'month' && this.precision !== 'day' && renderSeparator()}
          {this.precision !== 'month' && this.precision !== 'day' && (
            <br-time-picker
              ref={(ref) => (this.timePickerRef = ref)}
              theme={this.theme}
              format={this.format}
              value={this.timeValue || (this.value && this.value[0]) || undefined}
              size={this.size}
              showNowButton={false}
              precision={this.precision}
              onValueChange={this.handleTimeValueChange}
              min={this.min || defaultMinDate}
              max={this.max || defaultMaxDate}
            />
          )}
        </div>
        {(this.showNowButton || this.showTodayButton) && this.selection === 'single' && (
          <Fragment>
            <div class="br-date-picker-separator horizontal" />
            <div class="br-date-picker-now-button-container">
              {this.showTodayButton && (
                <br-button
                  theme={this.theme}
                  fillStyle="Ghost"
                  fullWidth={true}
                  colorType="Neutral"
                  size={this.size}
                  onClick={this.setToday}
                  disabled={this.value && isToday(this.value[0])}
                >
                  <span>Today</span>
                </br-button>
              )}
              {this.precision !== 'day' && this.precision !== 'month' && this.showNowButton && (
                <br-button
                  theme={this.theme}
                  fillStyle="Ghost"
                  fullWidth={true}
                  colorType="Neutral"
                  size={this.size}
                  onClick={this.setCurrentTime}
                  disabled={this.timeValue && isNow(this.timeValue, this.precision)}
                >
                  <span>Now</span>
                </br-button>
              )}
            </div>
          </Fragment>
        )}
      </Host>
    );
  }
}

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host,
  Method,
  State,
} from '@stencil/core';
import { CustomErrorMessages, CustomValidator, ErrorKey } from '../input/types/input-types';
import { BaseColorType, BaseSize, BaseSizes } from '../../reserved/editor-types';
import { isEqual } from 'lodash-es';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  clampDate,
  getFormatOptionsForParts,
  getFormattedString,
  getNextPart,
  getPartRange,
  getLastPartForPrecision,
  getSelectedDatePart,
  isDateBetween,
  parseFormattedDate,
} from '../../utils/date-time/date-time-utils';
import { DebugMode } from '../debug/types/utils';
import { isElementContained } from '../../utils/utils';

const GENERIC_FORMAT: RegExp = /([0-9])/;

// This id increments for all inputs on the page
let dateInputId = 0;

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
 * The Date input component enables a user to enter a date.
 * @category Inputs & Forms
 * @slot left-icon - Passes an icon to the Input.
 * @slot right-icon - Passes additional content to the Input.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 */
@Component({
  tag: 'br-date-input',
  styleUrl: './css/date-input.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class DateInput {
  /**
   * A reference to the native input element.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * A reference to the time picker ref.
   */
  private datePickerRef: HTMLBrDatePickerElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDateInputElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Stores an internal validity state to use with the error message.
   */
  @State() internalValidityState: {
    valid: boolean;
    firstError?: string;
    nativeErrors?: { [key: string]: string };
    customErrors?: { [key: string]: string };
  } = { valid: true };
  @Watch('internalValidityState')
  handleInternalValidityStateChange(newValue: {
    valid: boolean;
    firstError: string;
    nativeErrors?: { [key: string]: string };
    customErrors?: { [key: string]: string };
  }) {
    this.validityChange.emit(newValue);
  }
  /**
   * Stores the number of characters added.
   */
  @State() charactersTyped: number = 0;
  /**
   * Stores whether the input has been touched for error states.
   */
  @State() wasTouched: boolean = false;
  /**
   * Whether the input is focused.
   */
  @State() focused: boolean = false;
  /**
   * Whether the popover is open.
   */
  @State() popoverOpen: boolean | undefined = false;
  /**
   * Whether the time picker is hovered.
   */
  @State() timePickerHovered: boolean = false;
  /**
   * Stores the currently selected part of the time.
   */
  @State() selectedPart:
    | 'year'
    | 'month'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'fractionalSecond'
    | 'all'
    | 'dayPeriod'
    | undefined = undefined;
  @Watch('selectedPart')
  selectedPartChanged(
    newValue:
      | 'year'
      | 'month'
      | 'day'
      | 'hour'
      | 'minute'
      | 'second'
      | 'fractionalSecond'
      | 'all'
      | 'dayPeriod'
      | undefined,
    oldValue:
      | 'year'
      | 'month'
      | 'day'
      | 'hour'
      | 'minute'
      | 'second'
      | 'fractionalSecond'
      | 'all'
      | 'dayPeriod'
      | undefined,
  ) {
    if (newValue !== oldValue) {
      this.charactersTyped = 0;
      if (newValue === 'year') {
        this.temporaryValue = this.inputRef?.value;
      }
    }
  }
  /**
   * Stores the currently selected part of the time.
   */
  @State() previousSelectedPartValue: string | undefined = undefined;
  /**
   * Store a temporary value while typing.
   */
  @State() temporaryValue: string | undefined;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-input-${dateInputId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Solid';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: Date | undefined;
  @Watch('value')
  handleValueChanged(newValue: Date | undefined, oldValue: Date | undefined) {
    if (!isEqual(newValue, oldValue)) {
      this.wasTouched = true;
      const newValueToApply =
        newValue !== undefined ? this.getDateStringValueFromDate(newValue) : '';
      this.temporaryValue = undefined;
      if (this.inputRef && this.inputRef.value !== newValueToApply) {
        this.inputRef.value = newValueToApply;
      }
      if (this.popoverOpen) {
        setTimeout(() => {
          if (
            newValue?.getMonth() !== oldValue?.getMonth() ||
            newValue?.getFullYear() !== oldValue?.getFullYear()
          ) {
            this.datePickerRef?.setCurrentView(
              newValue || clampDate(new Date(), this.min, this.max, this.elm),
            );
          }
          this.datePickerRef?.scrollToCurrentValue();
        }, 0);
      }
      this.internals?.setFormValue(newValueToApply !== '' ? newValue?.toISOString() || null : null);
      this.valueChange.emit({ value: newValue });
      this.updateValidity();
    }
  }
  /**
   * Defines the time format of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() format: 24 | 12 = 24;
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?: Date;
  /**
   * Determines if the days of the previous and next month should be displayed in the component.
   * @category Appearance
   */
  @Prop() showFillDays: boolean = false;
  /**
   * Defines the name associated with this component in the context of a form.
   * @category Data
   */
  @Prop({ reflect: true }) name: string;
  /**
   * Defines the data validations that apply to this component.
   * @category Data
   * @visibility advanced
   */
  @Prop() validations?: CustomValidator<Date | undefined>[];
  /**
   * Defines whether the component should display an invalid state after an event and/or a specific event.
   * @category Data
   */
  @Prop() invalidAfterTouch: 'click' | 'change' | 'input' | 'blur' | boolean = 'input';
  /**
   * Determines whether an error message should be displayed and if yes which type.
   * @category Appearance
   */
  @Prop() errorDisplayType: 'inline' | 'tooltip' | false = 'tooltip';
  /**
   * Determines if the component is displayed in its readonly state.
   * @category State
   */
  @Prop({ reflect: true }) readonly: boolean = false;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean = false;
  /**
   * Determines if the component is required in a form context.
   * @category Data
   */
  @Prop() required?: boolean;
  /**
   * Defines the locale of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() locale: string = 'en-US';
  /**
   * Determines the placeholder displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() placeholder?: string;
  /**
   * Determines whether the component autofocuses.
   * @category Behavior
   */
  // eslint-disable-next-line @stencil-community/reserved-member-names
  @Prop({ reflect: true }) autoFocus?: boolean;
  /**
   * Determines whether the component supports autocomplete.
   * @category Behavior
   */
  @Prop() autoComplete?: 'off' | string = 'off';
  /**
   * Determines the increment value when the user clicks the stepper affordance.
   * @category Behavior
   */
  @Prop() step: number = 1;
  /**
   * Determines the increment value when the user clicks the stepper affordance and holds the shift key.
   * @category Behavior
   */
  @Prop() largeStep: number = 10;
  /**
   * Determines if the clear affordance is displayed in the component.
   * @category Appearance
   * @visibility persistent
   *
   */
  @Prop() showClearButton?: boolean = true;
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop() active?: boolean;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() width?: BaseSize<BaseSizes>;
  /**
   * Determines the precision of the component selection.
   * @category Data
   * @visibility persistent
   */
  @Prop() precision: 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' = 'minute';
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
  @Prop() min: Date = defaultMinDate;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: Date = defaultMaxDate;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() height?: BaseSize<BaseSizes>;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: Date | undefined }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{ value: string | undefined }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  @Event({ cancelable: true }) input!: EventEmitter<{ value: string | undefined }>;
  /**
   * An event that emits when the validity state changes.
   */
  @Event() validityChange!: EventEmitter<{
    valid: boolean;
    customErrors?: { [key: string]: string };
    nativeErrors?: { [key: string]: string };
  }>;
  /**
   * A method to clear the value of the input
   */
  @Method()
  async clearValue(): Promise<void> {
    if (!this.inputRef) {
      return;
    }
    this.wasTouched = true;
    this.value = undefined;
    this.inputRef.value = '';
    this.internals?.setFormValue(null);
    this.updateValidity();
    this.change.emit({ value: undefined });
  }
  /**
   * A method to set a custom validity state
   */
  @Method()
  async setInternalValidityState(validity: {
    valid: boolean;
    firstError?: string;
    nativeErrors?: { [key: string]: string };
    customErrors?: { [key: string]: string };
  }) {
    this.controlledInternalValidityState = true;
    this.internalValidityState = validity;
    const firstCustomError = !validity.valid && !isEqual(validity.customErrors, {});
    if (this.inputRef && !validity.valid && validity.firstError) {
      this.inputRef.setCustomValidity(validity.firstError);
    }
    const nativeErrorsBooleans =
      validity.nativeErrors && !isEqual(validity.nativeErrors, {})
        ? Object.entries(validity.nativeErrors).map((v) => [v[0], true])
        : {};
    this.internals?.setValidity(
      { ...nativeErrorsBooleans, customError: firstCustomError },
      validity.firstError,
      this.inputRef,
    );
  }
  /**
   * Method to get the validity state.
   */
  @Method()
  async getInternalValidityState(): Promise<{
    valid: boolean;
    firstError?: string;
    nativeErrors?: { [key: string]: string };
    customErrors?: { [key: string]: string };
  }> {
    return this.internalValidityState;
  }

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  componentWillLoad() {
    if (this.value !== undefined) {
      this.value = clampDate(this.value, this.min, this.max, this.elm);
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error(
          `WARNING - This input is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
          this.elm,
        );
      }
      this.internals?.setFormValue(this.value.toISOString());
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = clampDate(this.defaultValue, this.min, this.max, this.elm);
      this.internals?.setFormValue(this.defaultValue.toISOString());
    }
  }

  componentDidLoad() {
    if (this.internals?.form) {
      this.internals?.form.addEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
    if (this.autoFocus) {
      this.elm.focus();
    }
    this.updateValidity();
  }

  disconnectedCallback() {
    if (this.internals?.form) {
      this.internals?.form.removeEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
  }

  formResetCallback() {
    this.clearValue();
  }

  formStateRestoreCallback(state: Date | undefined) {
    this.value = state;
  }

  private convertTimeStringToDate = (value: string | undefined) => {
    if (value === '' || value === undefined) {
      return undefined;
    }
    const day = this.value || new Date();
    const parsedDate = parseFormattedDate(`${value}`, this.locale, this.format);
    return new Date(
      (parsedDate || day).getFullYear(),
      (parsedDate || day).getMonth(),
      (parsedDate || day).getDate(),
      parsedDate?.getHours() || 0,
      parsedDate?.getMinutes() || 0,
      parsedDate?.getSeconds() || 0,
      parsedDate?.getMilliseconds() || 0,
    );
  };

  private getDateStringValueFromDate = (value: Date) => {
    return getFormattedString(value, this.precision, this.locale, this.format);
  };

  private selectPart = (
    part:
      | 'year'
      | 'month'
      | 'day'
      | 'hour'
      | 'minute'
      | 'second'
      | 'fractionalSecond'
      | 'all'
      | 'dayPeriod',
  ) => {
    if (!this.inputRef) {
      return;
    }
    if (part === 'all') {
      return this.inputRef.select();
    }
    const lastPart = getLastPartForPrecision(this.precision, this.locale, this.format);
    const partIndex = getPartRange(part, this.locale, this.format, lastPart);
    this.selectedPart = part;
    if (partIndex) {
      this.inputRef.setSelectionRange(partIndex[0], partIndex[1]);
    }
  };

  private increment = (direction: 'up' | 'down', event: MouseEvent | KeyboardEvent) => {
    const stepToApply = !event.shiftKey ? this.step : this.largeStep;
    const modifier = direction === 'up' ? 1 : -1;

    if (!this.selectedPart || !this.inputRef) {
      return;
    }

    if (this.selectedPart === 'dayPeriod') {
      return this.toggleAmPm();
    }
    const partToSelect = this.selectedPart === 'all' ? 'hour' : this.selectedPart;
    const today = new Date();
    const date =
      this.value || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);

    const options = getFormatOptionsForParts(this.locale, this.format);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatter = new Intl.DateTimeFormat(this.locale, options as any);
    const formattedParts = formatter.formatToParts(date);

    const yearPart = formattedParts.find((p) => p.type === 'year')?.value;
    const monthPart = formattedParts.find((p) => p.type === 'month')?.value;
    const dayPart = formattedParts.find((p) => p.type === 'day')?.value;
    const hourPart = formattedParts.find((p) => p.type === 'hour')?.value;
    const minutePart = formattedParts.find((p) => p.type === 'minute')?.value;
    const secondPart = formattedParts.find((p) => p.type === 'second')?.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const millisecondPart = (formattedParts as any).find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.type === 'fractionalSecond',
    )?.value;

    const yearValue = yearPart ? Number(yearPart) : 0;
    const monthValue = monthPart ? Number(monthPart) - 1 : 0;
    const dayValue = dayPart ? Number(dayPart) : 0;
    const hourValue = hourPart ? Number(hourPart) : 0;
    const minuteValue = minutePart ? Number(minutePart) : 0;
    const secondValue = secondPart ? Number(secondPart) : 0;
    const millisecondValue = millisecondPart ? Number(millisecondPart) : 0;

    const newDate = new Date(
      yearValue + modifier * stepToApply * (partToSelect === 'year' ? 1 : 0),
      monthValue + modifier * stepToApply * (partToSelect === 'month' ? 1 : 0),
      dayValue + modifier * stepToApply * (partToSelect === 'day' ? 1 : 0),
      hourValue + modifier * stepToApply * (partToSelect === 'hour' ? 1 : 0),
      minuteValue + modifier * stepToApply * (partToSelect === 'minute' ? 1 : 0),
      secondValue + modifier * stepToApply * (partToSelect === 'second' ? 1 : 0),
      millisecondValue + modifier * stepToApply * (partToSelect === 'fractionalSecond' ? 1 : 0),
    );

    this.wasTouched = true;

    this.value = clampDate(newDate, this.min, this.max, this.elm);
    this.internals?.setFormValue(newDate.toISOString());
    this.updateValidity();
    this.change.emit({ value: this.value?.toISOString() });
    this.selectPart(this.selectedPart);
  };

  private toggleAmPm = (key?: string) => {
    this.focused = true;
    const decoratorString = this.value && this.value.getHours() >= 12 ? 'PM' : 'AM';
    const decorator = this.format === 24 ? null : decoratorString;
    if (decorator && this.inputRef) {
      const decoratorForKey = (key === 'a' && 'AM') || (key === 'pm' && 'PM') || undefined;
      const replacedValue = this.inputRef.value.replace(
        decoratorString,
        decoratorForKey || decoratorString === 'PM' ? 'AM' : 'PM',
      );
      const parsedDate = parseFormattedDate(`${replacedValue}`, this.locale, this.format);
      this.value = parsedDate ? clampDate(parsedDate, this.min, this.max, this.elm) : undefined;
    }
    setTimeout(() => {
      this.selectPart('dayPeriod');
    }, 0);
  };

  // Updates validity in the form context and the native input and stores the value in a retrievable state
  private updateValidity = () => {
    if (this.inputRef) {
      this.inputRef.setCustomValidity('');
      this.inputRef.checkValidity();
      const nativeValidity = this.inputRef.validity;
      const validationMessage = this.inputRef.validationMessage;
      this.internals?.setValidity(nativeValidity, validationMessage, this.inputRef);

      let valid = true;
      const customErrors: { [key: string]: string } = {};
      const nativeErrors: { [key: string]: string } = {};

      if (!nativeValidity.valid) {
        for (const key in nativeValidity) {
          const k = key as Exclude<ErrorKey, 'valid'>;
          const activeError = nativeValidity[k] && k !== 'customError';
          if (activeError) {
            valid = false;
            nativeErrors[k] = CustomErrorMessages[k];
          }
        }
      }
      if (this.validations) {
        this.validations.map((v) => {
          const invalid = v.isInvalid(this.convertTimeStringToDate(this.inputRef?.value));
          if (invalid) {
            this.internals?.setValidity(
              { ...this.inputRef?.validity, customError: true },
              v.errorMessage,
              this.inputRef,
            );
            this.inputRef!.setCustomValidity(v.errorMessage);
            valid = false;
            customErrors[v.name] = v.errorMessage;
          }
        });
      }
      const firstError =
        (Object.values({ ...nativeErrors, ...customErrors })[0] as string) || undefined;
      this.internalValidityState = {
        valid,
        firstError,
        nativeErrors,
        customErrors,
      };
    }
  };

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
  };

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
    }
    const parsedDate = this.convertTimeStringToDate(this.inputRef.value);
    this.value = parsedDate ? clampDate(parsedDate, this.min, this.max, this.elm) : undefined;
    this.internals?.setFormValue(this.value?.toISOString() || null);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.selectedPart === 'all' && (e.key === 'Backspace' || e.key === 'Delete')) {
      return this.clearValue();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      return (this.selectedPart = 'all');
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      return;
    }

    if (e.key === 'Enter') {
      const parentForm = this.internals?.form;
      if (parentForm) {
        return parentForm.requestSubmit();
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      return (this.popoverOpen = false);
    }

    const lastPart = getLastPartForPrecision(this.precision, this.locale, this.format);

    if (e.key === 'ArrowLeft') {
      const nextBackwardPart = getNextPart(
        this.selectedPart,
        'backward',
        this.locale,
        this.format,
        lastPart,
      );
      if (!nextBackwardPart) {
        return;
      }
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.selectPart(nextBackwardPart as any);
    }
    if (e.key === 'ArrowRight') {
      const nextForwardPart = getNextPart(
        this.selectedPart,
        'forward',
        this.locale,
        this.format,
        lastPart,
      );
      if (!nextForwardPart) {
        return;
      }
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.selectPart(nextForwardPart as any);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      return this.increment('up', e);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      return this.increment('down', e);
    }

    if (this.selectedPart === 'dayPeriod' && !e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      this.toggleAmPm(e.key);
    }

    if (!GENERIC_FORMAT.test(e.key) && e.key.length === 1) {
      e.preventDefault();
      return;
    }
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
    setTimeout(() => {
      if (this.inputRef) {
        const selectionStart = this.inputRef?.selectionStart || 0;
        const selectionEnd = this.inputRef?.selectionEnd || 0;

        if (selectionStart !== selectionEnd) {
          return;
        }
        const lastPart = getLastPartForPrecision(this.precision, this.locale, this.format);
        const part = getSelectedDatePart(selectionStart, this.locale, this.format, lastPart);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.selectedPart = part as any;
        const selectionRange = part
          ? getPartRange(part, this.locale, this.format, lastPart)
          : undefined;
        if (!selectionRange) {
          return;
        }
        this.inputRef.setSelectionRange(selectionRange[0], selectionRange[1]);
      }
    }, 0);
  };

  private handleNativeFocus = () => {
    this.focused = true;
    this.popoverOpen = true;
    const selectsEverything =
      this.value &&
      this.inputRef?.selectionStart === 0 &&
      this.getDateStringValueFromDate(this.value).toString().length === this.inputRef?.selectionEnd;
    const popover = this.elm.shadowRoot?.querySelector('br-popover');
    if (!popover?.isOpen) {
      this.elm.shadowRoot?.querySelector('br-popover')?.openElement();
    }
    setTimeout(() => {
      const typingValue = this.value ? this.getDateStringValueFromDate(this.value) : '';
      this.temporaryValue = typingValue;

      if (this.inputRef) {
        if (selectsEverything && !this.selectedPart) {
          this.selectedPart = 'all';
          return this.inputRef.select();
        }
      }
    }, 0);
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
    if (!this.timePickerHovered) {
      this.popoverOpen = false;
    }
    this.temporaryValue = undefined;
    this.selectedPart = undefined;
  };

  private handleNativeChange = (event: globalThis.Event) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
    const isValidValue = this.inputRef?.value
      ? parseFormattedDate(`${this.inputRef?.value}`, this.locale, this.format) !== null
      : undefined;
    if (isValidValue) {
      this.change.emit({
        value: this.convertTimeStringToDate(this.inputRef?.value)?.toISOString(),
      });
      this.handleChange(event);
    } else {
      if (!this.inputRef) {
        return;
      }
      this.inputRef.value = this.value ? this.getDateStringValueFromDate(this.value) : '';
    }
  };

  private handleNativeInput = (event: InputEvent) => {
    this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (!this.inputRef) {
      return;
    }

    if (this.selectedPart === 'all') {
      const options = getFormatOptionsForParts(this.locale, this.format);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatter = new Intl.DateTimeFormat(this.locale, options as any);
      const parts = formatter.formatToParts(new Date());
      const firstPart = parts[0].type;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.selectPart(firstPart as any);
    }

    if (this.selectedPart && this.selectedPart !== 'dayPeriod') {
      const options = getFormatOptionsForParts(this.locale, this.format);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatter = new Intl.DateTimeFormat(this.locale, options as any);
      const today = new Date();
      const date =
        this.value || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const dateParts = formatter.formatToParts(date);
      const selectedPartValue = dateParts.find((p) => p.type === this.selectedPart);

      const yearRange = getPartRange('year', this.locale, this.format);

      const temporaryValueYear =
        yearRange && this.temporaryValue
          ? this.temporaryValue.slice(yearRange[0], yearRange[1])
          : '0000 ';
      const selectedYearValue =
        this.selectedPart === 'year' && selectedPartValue && selectedPartValue.value
          ? selectedPartValue.value
          : '0000';
      const yearValue = temporaryValueYear !== '0000' ? temporaryValueYear : selectedYearValue;
      const prefixedYearValue =
        yearValue.toString().length < 4
          ? `${Array.from(Array(4 - yearValue.toString().length).keys())
              .map(() => {
                return '0';
              })
              .join('')}`
          : '';
      const yearArrayValue = `${prefixedYearValue}${yearValue}`;
      const stringValue =
        this.selectedPart === 'year' ? yearArrayValue : selectedPartValue?.value || '00';

      const yearLimitValue = this.selectedPart === 'year' ? 4 : 2;
      const limit = this.selectedPart === 'fractionalSecond' ? 3 : yearLimitValue;

      const yearTypedValue =
        limit === 4 &&
        ((this.charactersTyped === 0 ? `000${event.data}` : undefined) ||
          (this.charactersTyped === 1 ? `00${stringValue[3]}${event.data}` : undefined) ||
          (this.charactersTyped === 2
            ? `0${stringValue[2]}${stringValue[3]}${event.data}`
            : undefined) ||
          (this.charactersTyped === 3
            ? `${stringValue[1]}${stringValue[2]}${stringValue[3]}${event.data}`
            : ''));

      const fractionalTypedValue =
        limit === 3 &&
        ((this.charactersTyped === 0 ? `00${event.data}` : undefined) ||
          (this.charactersTyped === 1 ? `0${stringValue[2]}${event.data}` : undefined) ||
          (this.charactersTyped === 2 ? `${stringValue[1]}${stringValue[2]}${event.data}` : ''));
      const partTypedValue =
        limit === 2 &&
        ((this.charactersTyped === 0 ? `0${event.data}` : undefined) ||
          (this.charactersTyped === 1 ? `${stringValue[1]}${event.data}` : undefined) ||
          (this.charactersTyped === 2 ? `${stringValue[0]}${stringValue[1]}${event.data}` : ''));

      const yearTypedString = yearTypedValue !== false ? yearTypedValue : partTypedValue || '';

      const newValue = fractionalTypedValue !== false ? fractionalTypedValue : yearTypedString;

      this.charactersTyped = this.charactersTyped + 1;

      const selectedPartIndex = dateParts.findIndex((p) => p.type === this.selectedPart);

      dateParts[selectedPartIndex].value = newValue;

      const newDateString = dateParts.map((p) => p.value).join('');

      const isValid = parseFormattedDate(newDateString, this.locale, this.format);

      if (isValid && isDateBetween(isValid, this.min, this.max)) {
        this.value = isValid;
        this.inputRef.value = this.getDateStringValueFromDate(isValid);
        this.input.emit({
          value: this.convertTimeStringToDate(this.inputRef?.value)?.toISOString(),
        });
      } else {
        if (this.selectedPart === `year`) {
          this.inputRef.value = newDateString;
          this.temporaryValue = newDateString;
        }
      }

      setTimeout(() => {
        this.selectPart(this.selectedPart!);
      }, 0);

      if (this.charactersTyped >= limit) {
        this.charactersTyped = 0;
        const lastPart = getLastPartForPrecision(this.precision, this.locale, this.format);
        if (this.selectedPart === 'year' && this.temporaryValue) {
          const isValid = parseFormattedDate(this.temporaryValue, this.locale, this.format);
          if (isValid) {
            const clampedValue = clampDate(isValid, this.min, this.max, this.elm);
            this.value = clampedValue;
            this.inputRef.value = this.getDateStringValueFromDate(clampedValue);
            this.temporaryValue = undefined;
            this.input.emit({
              value: this.convertTimeStringToDate(this.inputRef?.value)?.toISOString(),
            });
          }
        } else {
          if (this.value) {
            this.inputRef.value = this.getDateStringValueFromDate(this.value);
            this.temporaryValue = undefined;
            this.input.emit({
              value: this.convertTimeStringToDate(this.inputRef?.value)?.toISOString(),
            });
          }
        }
        const nextPart = getNextPart(
          this.selectedPart,
          'forward',
          this.locale,
          this.format,
          lastPart,
        );
        if (nextPart) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.selectPart(nextPart as any);
        }
        return;
      }
    }
  };

  private handlePaste = (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    const pastedData = clipboardData?.getData('Text');
    e.preventDefault();

    if (!this.inputRef) {
      return;
    }

    const pastedTime = pastedData;
    const parsedDate = parseFormattedDate(`${pastedTime}`, this.locale, this.format);

    if (pastedData && parsedDate !== null) {
      this.inputRef.value = pastedData;
      this.change.emit({ value: this.convertTimeStringToDate(pastedData)?.toISOString() });
      this.handleChange(e);
    } else {
      this.inputRef.value = this.value ? this.getDateStringValueFromDate(this.value) : '';
    }
  };

  private handleTimePickerMouseOver = () => {
    this.timePickerHovered = true;
  };

  private handleTimePickerMouseLeave = () => {
    this.timePickerHovered = false;
  };

  private handleNativeWrapperClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.inputRef?.focus();
  };

  private handleFocusCheck = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const datePickerRef = this.datePickerRef;
      const popoverContentRef = this.elm.shadowRoot?.querySelector('br-popover-content');
      if (
        isElementContained(activeElement, this.elm) ||
        isElementContained(activeElement, datePickerRef) ||
        isElementContained(activeElement, popoverContentRef)
      ) {
        return;
      }
      this.popoverOpen = false;
      this.elm.shadowRoot?.querySelector('br-popover')?.closeElement();
    }, 0);
  };

  render() {
    const isTouched =
      !this.invalidAfterTouch || this.wasTouched || this.controlledInternalValidityState === true;

    const renderInputError = () => {
      const shouldDisplayError = !this.internalValidityState.valid && isTouched;
      if (shouldDisplayError && this.errorDisplayType) {
        return (
          <br-input-error-display theme={this.theme} type={this.errorDisplayType}>
            <span slot="message">
              <slot name="error-message">{this.internalValidityState.firstError}</slot>
            </span>
          </br-input-error-display>
        );
      }
    };

    const internalButtonProps: {
      theme: Theme;
      fillStyle: FillStyle;
      colorType: BaseColorType<ColorType>;
    } = {
      theme: this.theme,
      fillStyle: 'Ghost',
      colorType: 'Neutral',
    };

    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
          flexShrink: this.width ? `0` : '',
        }}
        onFocusout={this.handleFocusCheck}
      >
        <br-popover
          trapFocus={false}
          placement="bottom-start"
          showArrow={false}
          theme={this.theme}
          minWidth={false}
          onOpen={() => {
            setTimeout(() => {
              if (this.value) {
                this.datePickerRef?.setCurrentView(this.value);
              }
              this.datePickerRef?.scrollToCurrentValue();
            }, 0);
          }}
          interaction="click"
        >
          <div
            slot="target"
            class={{
              'br-input-wrapper': true,
              'br-input-was-touched': isTouched || this.active === true,
              'br-input-focused': this.focused || this.active === true || this.popoverOpen === true,
              'br-input-disabled': this.disabled,
              'br-input-readonly': this.readonly,
              'br-input-invalid': isTouched && !this.internalValidityState.valid,
            }}
            onClick={this.handleNativeWrapperClick}
          >
            <slot name="left-icon"></slot>
            <div part="resizer" class="br-input-content-resizer">
              <input
                disabled={this.disabled}
                readonly={this.readonly}
                defaultValue={
                  this.defaultValue ? this.getDateStringValueFromDate(this.defaultValue) : undefined
                }
                autoFocus={this.autoFocus}
                autocomplete={this.autoComplete}
                placeholder={this.placeholder}
                name={this.name}
                ref={(ref) => (this.inputRef = ref)}
                required={this.required}
                type="text"
                value={
                  this.temporaryValue ||
                  (this.value ? this.getDateStringValueFromDate(this.value) : undefined)
                }
                size={undefined}
                onBlur={this.handleNativeBlur}
                onClick={this.handleNativeClick}
                onFocus={this.handleNativeFocus}
                onChange={this.handleNativeChange}
                onInput={this.handleNativeInput}
                onKeyDown={this.handleKeyDown}
                onPaste={this.handlePaste}
              />
              <span>
                <span class="br-input-resizer-ghost">
                  {(this.value
                    ? this.getDateStringValueFromDate(this.value).replace(/ /g, '\u00a0')
                    : undefined) || this.placeholder?.replace(/ /g, '\u00a0')}
                </span>
              </span>
            </div>
            <slot name="tooltip-error">
              {this.errorDisplayType === 'tooltip' && renderInputError()}
            </slot>
            {this.showClearButton && !this.disabled && !this.readonly && (
              <br-button
                {...internalButtonProps}
                class="br-clear-value-button"
                onClick={() => this.clearValue()}
                disabled={!this.value}
                size={this.size !== 'Large' ? 'Small' : 'Normal'}
              >
                <br-icon slot="left-icon" iconName="Cross" />
              </br-button>
            )}
            <slot name="right-icon"></slot>
          </div>
          <br-popover-content theme={this.theme} noPadding={true}>
            <br-date-picker
              ref={(ref) => (this.datePickerRef = ref)}
              onMouseOver={this.handleTimePickerMouseOver}
              onMouseOut={this.handleTimePickerMouseLeave}
              precision={this.precision}
              size={this.size}
              min={this.min}
              max={this.max}
              format={this.format}
              showFillDays={this.showFillDays}
              theme={this.theme}
              value={this.value ? [this.value] : undefined}
              onValueChange={(e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.value = e.detail.value ? e.detail.value[0] : undefined;
                if (this.popoverOpen) {
                  if (!this.selectedPart) {
                    this.change.emit({ value: this.value?.toISOString() });
                    this.inputRef?.select();
                  }
                }
              }}
            />
          </br-popover-content>
        </br-popover>
        <div class="br-input-annotation-wrapper">
          <slot name="hint"></slot>
          <slot name="inline-error">
            {this.errorDisplayType === 'inline' && renderInputError()}
          </slot>
        </div>
      </Host>
    );
  }
}

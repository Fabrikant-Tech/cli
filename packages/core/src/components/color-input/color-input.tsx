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
import { ColorChangeContent } from '../color-picker/types/color-picker-types';
import { CustomErrorMessages, CustomValidator, ErrorKey } from '../input/types/input-types';
import {
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseOpacityModel,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
  convertGenericZeroToOneToNumber,
  convertNumberToGenericZeroToOne,
} from '../../reserved/editor-types';
import { isEqual } from 'lodash-es';
import {
  determineColorSpace,
  emitChange,
  getValueBasedOnColorSpace,
  getValueWithOpacity,
  incrementHex,
} from '../color-picker/utils/utils';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import chroma from 'chroma-js';
import { DebugMode } from '../debug/types/utils';
import { isElementContained } from '../../utils/utils';

// This id increments for all inputs on the page
let inputId = 0;

/**
 * The Input component enables a user to enter information.
 * @category Inputs & Forms
 * @slot left-icon - Passes an icon to the Input.
 * @slot right-icon - Passes additional content to the Input.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 */
@Component({
  tag: 'br-color-input',
  styleUrl: './css/color-input.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class ColorInput {
  /**
   * A reference to the native input element.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrColorInputElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Tracks a temporary value that is being typed.
   */
  @State() temporaryValue:
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined;
  @Watch('temporaryValue')
  handleTemporaryValueChanged(
    newValue:
      | BaseHexColor
      | BaseRgbColor
      | BaseRgbaColor
      | BaseHSLColor
      | BaseHSLAColor
      | undefined,
    oldValue:
      | BaseHexColor
      | BaseRgbColor
      | BaseRgbaColor
      | BaseHSLColor
      | BaseHSLAColor
      | undefined,
  ) {
    if (newValue !== oldValue) {
      const isValidColor = chroma.valid(newValue);
      if (!isValidColor || !newValue) {
        return;
      }
      const colorSpace = determineColorSpace(newValue);
      this.value = getValueBasedOnColorSpace(newValue, colorSpace, this);
      setTimeout(() => {
        const alpha = chroma(newValue).alpha();
        if (alpha !== convertGenericZeroToOneToNumber(this.opacity)) {
          this.opacity = convertNumberToGenericZeroToOne(alpha);
        }
      }, 0);
    }
  }
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
  @State() colorPickerHovered: boolean = false;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-input-${inputId++}`;
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
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   * @order 2
   */
  @Prop({ mutable: true }) value?:
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor;
  @Watch('value')
  handleValueChanged(
    newValue:
      | BaseHexColor
      | BaseRgbColor
      | BaseRgbaColor
      | BaseHSLColor
      | BaseHSLAColor
      | undefined,
    oldValue:
      | BaseHexColor
      | BaseRgbColor
      | BaseRgbaColor
      | BaseHSLColor
      | BaseHSLAColor
      | undefined,
  ) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const newValueToApply = newValue !== undefined ? newValue : '';

      const valueWithOpacity =
        newValueToApply !== ''
          ? (getValueWithOpacity(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              newValueToApply as any,
              convertGenericZeroToOneToNumber(this.opacity),
              this,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any)
          : '';
      if (this.inputRef && this.inputRef.value !== newValueToApply && !this.temporaryValue) {
        this.inputRef.value = valueWithOpacity;
      }
      this.internals?.setFormValue(valueWithOpacity !== '' ? valueWithOpacity : null);
      emitChange(newValue, this);
      this.updateValidity();
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?:
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined;
  /**
   * Defines the opacity of the color.
   * @category Data
   * @visibility persistent
   */
  @Prop({ reflect: true }) opacity: BaseOpacityModel = '1';
  @Watch('opacity')
  handleOpacityChanged(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const newValueToApply = this.value !== undefined ? this.value : '';

      const valueWithOpacity =
        newValueToApply !== ''
          ? (getValueWithOpacity(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              newValueToApply as any,
              convertGenericZeroToOneToNumber(this.opacity),
              this,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any)
          : '';
      if (this.inputRef && this.inputRef.value !== newValueToApply && !this.temporaryValue) {
        this.inputRef.value = valueWithOpacity;
      }
      this.internals?.setFormValue(valueWithOpacity !== '' ? valueWithOpacity : null);
      emitChange(newValue, this);
      this.updateValidity();
    }
  }
  /**
   * Defines a list of preset colors to display below the component.
   * @category Data
   */
  @Prop() presets?: {
    value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor;
    opacity?: BaseOpacityModel;
  }[];
  /**
   * Defines the color spaces the component allows users to select.
   * @category Data
   * @visibility persistent
   */
  @Prop() allowedColorSpaces?: ('hex' | 'rgb' | 'hsl')[] = ['hex', 'rgb', 'hsl'];
  /**
   * Defines the default color space the component uses.
   * @category Data
   * @visibility persistent
   */
  @Prop() defaultColorSpace?: 'hex' | 'rgb' | 'hsl' = 'hex';
  /**
   * Determines whether the component shows the opacity affordance.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) showOpacityAffordance: boolean = true;
  /**
   * Determines whether the component shows inputs to select specific color values.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showInputAffordances?: boolean = true;
  /**
   * Determines whether the component shows the eye dropper and if yes where.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showEyeDropperAffordance?: 'inline' | 'picker' | boolean = 'inline';
  /**
   * Determines whether the component shows the currently selected color preview and if yes where.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showColorPreview?: 'inline' | 'picker' | boolean = 'inline';
  /**
   * Determines whether the component shows a preset with an undefined value.
   * @category Data
   * @visibility persistent
   */
  @Prop() showEmptyPreset?: boolean = false;
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
  @Prop() validations?: CustomValidator<
    BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | undefined
  >[];
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
   * Determines if the clear affordance is displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showClearButton?: boolean = true;
  /**
   * Determines where the text caret is placed when the component focuses.
   * @category Behavior
   */
  @Prop() caretOnFocus?: 'selection' | 'start' | 'end';
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop() active?: boolean;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop() width?: BaseSize<BaseSizes>;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<ColorChangeContent>;
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
    this.opacity = '1';
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
    if (
      this.value !== undefined &&
      DebugMode.currentDebug &&
      this.elm.closest('br-debug-wrapper')
    ) {
      console.error(
        `WARNING - This input is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
        this.elm,
      );
      const colorSpace = determineColorSpace(this.value);
      this.defaultColorSpace = colorSpace;
      this.internals?.setFormValue(
        getValueWithOpacity(this.value, convertGenericZeroToOneToNumber(this.opacity), this),
      );
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;

      const colorSpace = determineColorSpace(this.defaultValue);
      this.defaultColorSpace = colorSpace;
      this.internals?.setFormValue(
        getValueWithOpacity(this.defaultValue, convertGenericZeroToOneToNumber(this.opacity), this),
      );
    }
    setTimeout(() => {
      if (!this.value) {
        return;
      }
      const alpha = chroma(this.value).alpha();
      if (alpha !== 1) {
        this.opacity = convertNumberToGenericZeroToOne(alpha);
      }
    }, 0);
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

  formStateRestoreCallback(
    state: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | undefined,
  ) {
    this.value = state;
  }

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
    }
    if (this.inputRef?.value === '' || !this.inputRef.value) {
      this.value = undefined;
      this.internals?.setFormValue(null);
    }
  }

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
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
          const invalid = v.isInvalid(
            this.inputRef?.value as
              | BaseHexColor
              | BaseRgbColor
              | BaseRgbaColor
              | BaseHSLColor
              | BaseHSLAColor,
          );
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

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parentForm = this.internals?.form;
      if (parentForm) {
        parentForm.requestSubmit();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.temporaryValue = undefined;
      this.increment('up', e);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.temporaryValue = undefined;
      this.increment('down', e);
    }
  };

  private increment = (direction: 'up' | 'down', event: MouseEvent | KeyboardEvent) => {
    const colorSpace = this.value ? determineColorSpace(this.value) : this.defaultColorSpace;
    const stepToApply = !event.shiftKey ? 1 : 10;
    const modifier =
      direction === 'up'
        ? 1 * (colorSpace === 'hsl' ? 10 : 1)
        : -1 * (colorSpace === 'hsl' ? 10 : 1);
    const hexValue = this.value ? chroma(this.value).hex() : '#000000';
    const incrementedValue = incrementHex(hexValue, modifier * stepToApply) as `#${string}`;
    const convertedValue = getValueBasedOnColorSpace(incrementedValue, colorSpace, this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.value = convertedValue as any;
    this.internals?.setFormValue(this.value || null);
    this.updateValidity();
    this.change.emit({ value: this.value });
  };

  private handleNativeWrapperClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.inputRef?.focus();
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    this.focused = true;
    this.popoverOpen = true;

    const popover = this.elm.shadowRoot?.querySelector('br-popover');
    if (!popover?.isOpen) {
      this.elm.shadowRoot?.querySelector('br-popover')?.openElement();
    }
    const selectsEverything =
      this.value &&
      this.inputRef?.selectionStart === 0 &&
      this.value.toString().length === this.inputRef?.selectionEnd;
    setTimeout(() => {
      if (this.inputRef) {
        if (this.caretOnFocus === 'selection' || (selectsEverything && !this.caretOnFocus)) {
          return this.inputRef.select();
        }
        if (this.caretOnFocus === 'start') {
          return this.inputRef.setSelectionRange(0, 0);
        }
        const value = this.inputRef?.value ? this.inputRef.value : '';
        return this.inputRef.setSelectionRange(value.toString().length, value.toString().length);
      }
    }, 0);
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
    const inputValue = this.inputRef?.value;
    const isValidColor = chroma.valid(inputValue);
    this.temporaryValue = undefined;
    this.popoverOpen = false;

    if (isValidColor && inputValue !== this.value && inputValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alpha = chroma(inputValue as any).alpha();
      if (alpha !== 1) {
        this.opacity = convertNumberToGenericZeroToOne(alpha);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const colorSpace = determineColorSpace(inputValue as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.value = getValueBasedOnColorSpace(inputValue as any, colorSpace, this) as any;
      this.updateValidity();
    }
    if (!isValidColor && this.inputRef) {
      this.inputRef.value = this.value
        ? getValueWithOpacity(this.value, convertGenericZeroToOneToNumber(this.opacity), this)
        : '';
      this.updateValidity();
    }
  };

  private handleFocusCheck = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const colorPicker = this.elm.shadowRoot?.querySelector('br-color-picker');
      if (
        isElementContained(activeElement, this.elm) ||
        isElementContained(activeElement, colorPicker)
      ) {
        return;
      }
      if (this.colorPickerHovered) {
        return;
      }
      this.elm.shadowRoot?.querySelector('br-popover')?.closeElement();
    }, 0);
  };

  private handleNativeChange = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
    this.change.emit({ value: this.inputRef?.value });
    this.handleChange(event);
  };

  private handleNativeInput = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.temporaryValue = this.inputRef?.value as
      | BaseHexColor
      | BaseRgbColor
      | BaseRgbaColor
      | BaseHSLColor
      | BaseHSLAColor
      | undefined;
    this.input.emit({ value: this.inputRef?.value });
    this.handleChange(event);
    this.updateValidity();
  };

  private handleTimePickerMouseOver = () => {
    this.colorPickerHovered = true;
  };

  private handleTimePickerMouseLeave = () => {
    this.colorPickerHovered = false;
  };

  private handlePaste = (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    const pastedData = clipboardData?.getData('Text');
    e.preventDefault();

    if (!this.inputRef) {
      return;
    }

    const isValidColor = chroma.valid(pastedData);
    if (isValidColor && pastedData !== this.value && pastedData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const colorSpace = determineColorSpace(pastedData as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.value = getValueBasedOnColorSpace(pastedData as any, colorSpace as any, this) as any;
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const alpha = chroma(pastedData as any).alpha();
        if (alpha !== 1) {
          this.opacity = convertNumberToGenericZeroToOne(alpha);
        }
      }, 0);
      this.updateValidity();
    }
    if (!isValidColor && this.inputRef) {
      this.inputRef.value = this.value
        ? getValueWithOpacity(this.value, convertGenericZeroToOneToNumber(this.opacity), this)
        : '';
      this.updateValidity();
    }
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
      colorType: BaseColorType<ColorType, 'Black' | 'White'>;
    } = {
      theme: this.theme,
      fillStyle: 'Ghost',
      colorType: 'Neutral',
    };

    return (
      <Host
        style={{
          width: this.width,
          flexShrink: this.width ? `0` : '',
        }}
        onFocusout={this.handleFocusCheck}
      >
        <br-popover
          trapFocus={false}
          focusContentOnOpen={false}
          focusTargetOnClose={false}
          isOpen={undefined}
          placement="bottom-start"
          showArrow={false}
          theme={this.theme}
          minWidth={false}
        >
          <div
            slot="target"
            class={{
              'br-input-wrapper': true,
              'br-input-was-touched': isTouched || this.active === true,
              'br-input-focused': this.focused || this.active === true,
              'br-input-disabled': this.disabled,
              'br-input-readonly': this.readonly,
              'br-input-invalid': isTouched && !this.internalValidityState.valid,
            }}
            onClick={this.handleNativeWrapperClick}
          >
            <slot name="left-icon">
              {(this.showColorPreview === 'inline' || this.showColorPreview === true) && (
                <br-color-preview
                  padding="calc(var(--input-icon-margin) / 2)"
                  theme={this.theme}
                  value={this.value}
                  opacity={this.opacity}
                />
              )}
            </slot>
            <div part="resizer" class="br-input-content-resizer">
              <input
                disabled={this.disabled}
                readonly={this.readonly}
                defaultValue={this.defaultValue?.toString()}
                autoFocus={this.autoFocus}
                autocomplete={this.autoComplete}
                placeholder={this.placeholder}
                name={this.name}
                ref={(ref) => (this.inputRef = ref)}
                required={this.required}
                value={
                  this.temporaryValue ||
                  (this.value
                    ? getValueWithOpacity(
                        this.value,
                        convertGenericZeroToOneToNumber(this.opacity),
                        this,
                      )
                    : undefined)
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
                  {(
                    this.temporaryValue ||
                    (this.value
                      ? getValueWithOpacity(
                          this.value,
                          convertGenericZeroToOneToNumber(this.opacity),
                          this,
                        )
                      : undefined)
                  )
                    ?.toString()
                    .replace(/ /g, '\u00a0') ||
                    this.placeholder?.replace(/ /g, '\u00a0') ||
                    '\u00a0'}
                </span>
              </span>
            </div>
            <slot name="tooltip-error">
              {this.errorDisplayType === 'tooltip' && renderInputError()}
            </slot>
            {(this.showEyeDropperAffordance === 'inline' ||
              this.showEyeDropperAffordance === true) && (
              <br-color-eye-dropper
                size="Small"
                theme={this.theme}
                fillStyle="Ghost"
                colorType="Neutral"
                onClick={(e) => {
                  e.stopImmediatePropagation();
                  e.stopPropagation();
                }}
                disabled={this.disabled}
                onPick={(e) => {
                  const currentColorSpace = this.value ? determineColorSpace(this.value) : 'hex';
                  this.value = getValueBasedOnColorSpace(
                    e.detail.sRGBHex as `#${string}`,
                    currentColorSpace,
                    this,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any;
                  emitChange(this.value, this);
                }}
              />
            )}
            {this.showClearButton && !this.disabled && !this.readonly && (
              <br-button
                {...internalButtonProps}
                class="br-clear-value-button"
                onClick={(e) => {
                  e.stopImmediatePropagation();
                  e.stopPropagation();
                  this.clearValue();
                }}
                disabled={!this.value}
                size={this.size !== 'Large' ? 'Small' : 'Normal'}
              >
                <br-icon slot="left-icon" iconName="Cross" />
              </br-button>
            )}
            <slot name="right-icon"></slot>
          </div>
          <br-popover-content theme={this.theme}>
            <br-color-picker
              onMouseOver={this.handleTimePickerMouseOver}
              onMouseLeave={this.handleTimePickerMouseLeave}
              onBlur={() => {
                this.handleFocusCheck();
              }}
              theme={this.theme}
              opacity={this.opacity}
              allowedColorSpaces={this.allowedColorSpaces}
              defaultColorSpace={this.defaultColorSpace}
              showEyeDropperAffordance={
                this.showEyeDropperAffordance === true || this.showEyeDropperAffordance === 'picker'
              }
              showColorPreview={
                this.showColorPreview === true || this.showColorPreview === 'picker'
              }
              showEmptyPreset={this.showEmptyPreset}
              showInputAffordances={this.showInputAffordances}
              showOpacityAffordance={this.showOpacityAffordance}
              value={this.value}
              presets={this.presets}
              onValueChange={(e) => {
                if (e.detail.value === this.value && e.detail.opacity === this.opacity) {
                  return;
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.value = e.detail.value ? e.detail.value : undefined;
                this.opacity = e.detail.opacity;
                if (this.popoverOpen) {
                  emitChange(this.value, this);
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

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
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { CustomErrorMessages, CustomValidator, ErrorKey } from './types/input-types';
import { isEqual } from 'lodash-es';
import { BaseColorType, BaseSize, BaseSizes } from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';

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
  tag: 'br-input',
  styleUrl: './css/input.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class Input {
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
  @Element() elm: HTMLBrInputElement;
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
   * Stores whether the input has been touched for error states.
   */
  @State() wasTouched: boolean = false;
  /**
   * Whether the input is focused.
   */
  @State() focused: boolean = false;
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
   * Determines the type of input the component supports. Provides default HTML input behaviors.
   * @category Data
   * @visibility persistent
   */
  @Prop() type?:
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'url'
    | 'search'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'time' = 'text';
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: string | undefined;
  @Watch('value')
  handleValueChanged(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const newValueToApply = newValue !== undefined ? newValue.toString() : '';
      if (this.inputRef && this.inputRef.value !== newValueToApply) {
        this.inputRef.value = newValueToApply;
      }
      this.internals?.setFormValue(newValueToApply !== '' ? newValueToApply : null);
      this.valueChange.emit({ value: newValue });
      this.updateValidity();
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?: string | undefined;
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
  @Prop() validations?: CustomValidator<string | undefined>[];
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
   * Determines the pattern the component must match to be valid.
   * @category Data
   */
  @Prop() pattern?: string;
  /**
   * Determines the minimum value for the component.
   * @category Data
   */
  @Prop() min?: number;
  /**
   * Determines the maximum value for the component.
   * @category Data
   */
  @Prop() max?: number;
  /**
   * Determines the minimum length of the value of the component.
   * @category Data
   */
  @Prop() minLength?: number;
  /**
   * Determines the maximum length of the value of the component.
   * @category Data
   */
  @Prop() maxLength?: number;
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
   */
  @Prop() showClearButton?: boolean = true;
  /**
   * Determines the keys that are allowed by the component.
   * @category Behavior
   */
  @Prop() allowedKeys?: string[] | RegExp;
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
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: string | undefined }>;
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
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error(
          `WARNING - This input is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
          this.elm,
        );
      }
      this.internals?.setFormValue(this.value.toString());
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      this.internals?.setFormValue(this.defaultValue.toString());
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

  formStateRestoreCallback(state: string | undefined) {
    this.value = state;
  }

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
    }
    this.value = this.inputRef.value;
    this.internals?.setFormValue(this.inputRef.value !== '' ? this.inputRef.value : null);
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
          const invalid = v.isInvalid(this.inputRef?.value);
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

    const shouldSkipKey =
      (this.allowedKeys instanceof RegExp && !e.key.match(this.allowedKeys)) ||
      (Array.isArray(this.allowedKeys) && !this.allowedKeys.includes(e.key));
    if (shouldSkipKey) {
      e.preventDefault();
    }

    if (e.key === 'ArrowUp' && this.type === 'number') {
      e.preventDefault();
      this.increment('up', e);
    }

    if (e.key === 'ArrowDown' && this.type === 'number') {
      e.preventDefault();
      this.increment('down', e);
    }
  };

  private increment = (direction: 'up' | 'down', event: MouseEvent | KeyboardEvent) => {
    const stepToApply = !event.shiftKey ? this.step : this.largeStep;
    const modifier = direction === 'up' ? 1 : -1;
    const newValue = (this.value ? Number(this.value) : 0) + modifier * stepToApply;
    this.wasTouched = true;
    this.value = newValue.toString();
    this.internals?.setFormValue(newValue.toString());
    this.updateValidity();
    this.change.emit({ value: newValue.toString() });
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    this.focused = true;
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
    this.input.emit({ value: this.inputRef?.value });
    this.handleChange(event);
    this.updateValidity();
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

    const renderIncrementButtons = () => {
      if (this.type !== 'number') {
        return;
      }
      return (
        <br-control-group class="br-input-increment-button-group" direction="vertical">
          <br-button
            onClick={(e) => this.increment('up', e)}
            {...internalButtonProps}
            size={this.size !== 'Large' ? 'Xsmall' : 'Normal'}
            height="50%"
          >
            <br-icon slot="left-icon" iconName="ChevronUp" />
          </br-button>
          <br-button
            onClick={(e) => this.increment('down', e)}
            {...internalButtonProps}
            size={this.size !== 'Large' ? 'Xsmall' : 'Normal'}
            height="50%"
          >
            <br-icon slot="left-icon" iconName="ChevronDown" />
          </br-button>
        </br-control-group>
      );
    };

    return (
      <Host
        style={{
          width: this.width,
          flexShrink: this.width ? `0` : '',
        }}
      >
        <div
          class={{
            'br-input-wrapper': true,
            'br-input-was-touched': isTouched || this.active === true,
            'br-input-focused': this.focused || this.active === true,
            'br-input-disabled': this.disabled,
            'br-input-readonly': this.readonly,
            'br-input-invalid': isTouched && !this.internalValidityState.valid,
          }}
        >
          <slot name="left-icon"></slot>
          <div part="resizer" class="br-input-content-resizer">
            <input
              disabled={this.disabled}
              readonly={this.readonly}
              defaultValue={this.defaultValue?.toString()}
              autoFocus={this.autoFocus}
              autocomplete={this.autoComplete}
              placeholder={this.placeholder}
              pattern={this.pattern}
              name={this.name}
              min={this.min}
              max={this.max}
              minLength={this.minLength}
              maxLength={this.maxLength}
              ref={(ref) => (this.inputRef = ref)}
              required={this.required}
              type={this.type}
              value={this.value !== '' ? this.value : undefined}
              size={undefined}
              onBlur={this.handleNativeBlur}
              onClick={this.handleNativeClick}
              onFocus={this.handleNativeFocus}
              onChange={this.handleNativeChange}
              onInput={this.handleNativeInput}
              onKeyDown={this.handleKeyDown}
            />
            <span>
              <span class="br-input-resizer-ghost">
                {this.value?.toString().replace(/ /g, '\u00a0') ||
                  this.placeholder?.replace(/ /g, '\u00a0') ||
                  '\u00a0'}
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
              disabled={!this.value || this.value === ''}
              size={this.size !== 'Large' ? 'Small' : 'Normal'}
            >
              <br-icon slot="left-icon" iconName="Cross" />
            </br-button>
          )}
          {renderIncrementButtons()}
          <slot name="right-icon"></slot>
        </div>
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

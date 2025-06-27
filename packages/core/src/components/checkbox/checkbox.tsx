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
import { isEqual } from 'lodash-es';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { DebugMode } from '../debug/types/utils';

// This id increments for all inputs on the page
let checkboxId = 0;

/**
 * The Checkbox component enables users to click to check a box to select an option.
 * @category Inputs & Forms
 * @slot - Passes a label to the input.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 */
@Component({
  tag: 'br-checkbox',
  styleUrl: './css/checkbox.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class Checkbox {
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
  @Element() elm: HTMLBrCheckboxElement;
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
   * Stores whether the element has been pressed to determine if the element should show a focused state.
   */
  @State() isPressed: boolean = false;
  /**
   * Determines if the component is checked.
   * @category Data
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) checked?: boolean;
  @Watch('checked')
  handleValueChanged(newValue: boolean | undefined, oldValue: boolean | undefined) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const newValueToApply = this.getValueFromProps();
      if (this.inputRef && this.inputRef.checked !== newValue) {
        this.inputRef.checked = newValue || false;
      }
      this.internals?.setFormValue(newValueToApply !== '' ? newValueToApply : null);
      this.valueChange.emit({ value: newValueToApply });
      this.updateValidity();
    }
  }
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-input-${checkboxId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value: string | number | undefined;
  /**
   * Determines if the component is checked by default.
   * @category Data
   * @visibility persistent
   */
  @Prop() defaultChecked: boolean;
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
  @Prop() validations?: CustomValidator<string | number | undefined>[];
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
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop() active?: boolean;
  /**
   * Determines if the component is displayed in its indeterminate state.
   * @category State
   */
  @Prop() indeterminate?: boolean;
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
    this.checked = false;
    this.inputRef.checked = false;
    this.internals?.setFormValue(null);
    this.updateValidity();
    this.change.emit({ value: '' });
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
      const valueToSet = this.getValueFromProps();
      this.internals?.setFormValue(valueToSet !== '' ? valueToSet : null);
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultChecked) {
      this.checked = this.defaultChecked;
      const valueToSet = this.getValueFromProps();
      this.internals?.setFormValue(valueToSet !== '' ? valueToSet : null);
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

  formStateRestoreCallback(state: boolean) {
    this.checked = state;
  }

  private getValueFromProps = () => {
    const isChecked = this.checked;
    const value = this.value ? this.value : 'on';
    return isChecked ? value.toString() : '';
  };

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
    }
    this.checked = (event.target as HTMLInputElement).checked;
    const valueToSet = this.getValueFromProps();
    this.internals?.setFormValue(valueToSet !== '' ? valueToSet : null);
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
        return parentForm.requestSubmit();
      }
    }
    const previousElementSibling = this.elm.previousElementSibling;
    const nextElementSibling = this.elm.nextElementSibling;
    if (e.key === 'ArrowUp') {
      if (
        previousElementSibling &&
        previousElementSibling.tagName.toLowerCase() === 'br-checkbox' &&
        (previousElementSibling as HTMLBrCheckboxElement).name === this.name
      ) {
        (this.elm.previousElementSibling as HTMLBrCheckboxElement).focus({ preventScroll: true });
      }
    }
    if (e.key === 'ArrowDown') {
      if (
        nextElementSibling &&
        nextElementSibling.tagName.toLowerCase() === 'br-checkbox' &&
        (nextElementSibling as HTMLBrCheckboxElement).name === this.name
      ) {
        (this.elm.nextElementSibling as HTMLBrCheckboxElement).focus({ preventScroll: true });
      }
    }
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    if (!this.isPressed) {
      this.focused = true;
    }
    this.isPressed = false;
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
    this.isPressed = false;
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

  private resolveMouseDown = () => {
    this.isPressed = true;
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

    return (
      <Host aria-checked={this.checked ? 'true' : undefined} role="checkbox">
        <div
          class={{
            'br-checkbox-wrapper': true,
            'br-checkbox-was-touched': isTouched || this.active === true,
            'br-checkbox-focused': this.focused || this.active === true,
            'br-checkbox-disabled': this.disabled,
            'br-checkbox-invalid': isTouched && !this.internalValidityState.valid,
          }}
        >
          <div
            class="br-checkbox-content"
            onMouseDown={this.resolveMouseDown}
            onClick={(e) => {
              const target = e.target as globalThis.Element;
              if (
                target.tagName.toLowerCase() !== 'input' &&
                this.elm.shadowRoot?.contains(target)
              ) {
                this.inputRef?.click();
              }
            }}
          >
            <div class="br-checkbox-control">
              <input
                checked={this.checked || undefined}
                type="checkbox"
                disabled={this.disabled}
                autoFocus={this.autoFocus}
                autocomplete={this.autoComplete}
                name={this.name}
                ref={(ref) => (this.inputRef = ref)}
                required={this.required}
                size={undefined}
                onBlur={this.handleNativeBlur}
                onClick={this.handleNativeClick}
                onFocus={this.handleNativeFocus}
                onChange={this.handleNativeChange}
                onInput={this.handleNativeInput}
                onKeyDown={this.handleKeyDown}
              />
              <slot name="checked-icon">
                {this.indeterminate ? (
                  <br-icon iconName="SmallMinus" />
                ) : (
                  <br-icon iconName="Checkmark" />
                )}
              </slot>
              <slot name="unchecked-icon"></slot>
            </div>
            <slot></slot>
          </div>
          <slot name="tooltip-error">
            {this.errorDisplayType === 'tooltip' && renderInputError()}
          </slot>
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

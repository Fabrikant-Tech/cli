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
import { BaseColorType, BaseSize, BaseSizes } from '../../reserved/editor-types';
import { CustomErrorMessages, CustomValidator } from '../input/types/input-types';
import { isEmpty, isEqual } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

// This id increments for all inputs on the page
let taginputId = 0;

/**
 * The Input component enables a user to enter information.
 * @category Inputs & Forms
 * @slot - Passes the tags to the Tag Input.
 * @slot left-icon - Passes an icon to the Input.
 * @slot right-icon - Passes additional content to the Input.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 * @slot {{label}}-tag-content - Dynamic slot name that allows passing custom rendered content to each tag input element.
 */
@Component({
  tag: 'br-tag-input',
  styleUrl: './css/tag-input.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class TagInput {
  /**
   * A reference to the native input element.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * Tracks whether the input should emit a change event.
   */
  private shouldEmitChange: boolean;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTagInputElement;
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
   * Determines the typed value next to the tags.
   * @category Data
   */
  @Prop({ mutable: true }) filterValue: string | undefined;
  /**
   * Determines if the type value is cleared on blur.
   * @category Behavior
   */
  @Prop() clearFilterOnBlur: boolean = true;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-tag-input-${taginputId++}`;
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
  @Prop({ mutable: true }) value:
    | string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { label: string; value: any; tagProps?: object }[]
    | undefined;
  @Watch('value')
  handleValueChanged(
    newValue: string[] | { label: string; value: string }[] | undefined,
    oldValue: string[] | { label: string; value: string }[] | undefined,
  ) {
    if (this.focused) {
      this.shouldEmitChange = true;
    }
    const formData = new FormData();
    if (newValue !== oldValue) {
      this.wasTouched = true;
      newValue?.map((v) => {
        formData.append(this.name, typeof v === 'string' ? v : v.value);
      });
      const newValueToApply = newValue !== undefined ? formData : null;
      this.internals?.setFormValue(newValueToApply);
      this.valueChange.emit({ value: newValue });
      this.updateValidity();
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() defaultValue?: string[] | { label: string; value: any }[] | undefined;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string[] | { label: string; value: any }[] | undefined
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
   * Determines wether typing in the input is allowed.
   * @category Behavior
   */
  @Prop() typingAllowed?: boolean;
  /**
   * Determines if the component is displayed in its readonly state.
   * @category State
   */
  @Prop() readonly: boolean = false;
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
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
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
   * Determines if the component allows the creation of new values on enter.
   * @category Behavior
   */
  @Prop() createValueOnEnter?: boolean = true;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{
    value: string[] | { label: string; value: string; tagProps?: object }[] | undefined;
  }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{
    value: string[] | { label: string; value: string; tagProps?: object }[] | undefined;
  }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  @Event({ cancelable: true }) input!: EventEmitter<{
    value: string[] | { label: string; value: string; tagProps?: object }[] | undefined;
  }>;
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

  private internalFocusOverride = (options?: FocusOptions): void => {
    this.inputRef?.focus({ preventScroll: true, ...(options || {}) });
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
      const formData = new FormData();
      this.value?.map((v) => {
        formData.append(this.name, typeof v === 'string' ? v : v.value);
      });
      this.internals?.setFormValue(formData);
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      const formData = new FormData();
      this.value?.map((v) => {
        formData.append(this.name, typeof v === 'string' ? v : v.value);
      });
      this.internals?.setFormValue(formData);
    }
  }

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
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
    state:
      | string[]
      | {
          label: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any;
          tagProps?: object;
        }[]
      | undefined,
  ) {
    this.value = state;
  }

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
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

      if (this.required) {
        if (!this.value) {
          const errorMessage = CustomErrorMessages['valueMissing'];
          this.internals?.setValidity({ valueMissing: true }, errorMessage, this.inputRef);
          this.inputRef!.setCustomValidity(errorMessage);
          valid = false;
          nativeErrors['valueMissing'] = errorMessage;
        }
      }
      if (this.validations) {
        this.validations.map((v) => {
          const invalid = v.isInvalid(this.value);
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
      if (this.inputRef?.value === undefined || this.inputRef?.value === '') {
        const parentForm = this.internals?.form;
        if (parentForm) {
          parentForm.requestSubmit();
        }
      }
      if (this.inputRef?.value && this.inputRef?.value !== '' && this.createValueOnEnter) {
        const values = this.value || [];
        const valueAlreadyExists = !isEmpty(
          values.filter((t) => {
            if (typeof t === 'string') {
              return t === this.inputRef?.value;
            } else {
              return t.label === this.inputRef?.value || t.value === this.inputRef?.value;
            }
          }),
        );
        const newValue = [...values, this.inputRef.value] as
          | string[]
          | { label: string; value: string }[];
        this.inputRef.value = '';
        this.filterValue = undefined;
        if (valueAlreadyExists) {
          return;
        }
        this.value = newValue;
      }
    }

    if (
      e.key === 'Backspace' &&
      (this.inputRef?.value === undefined || this.inputRef?.value === '')
    ) {
      const newValue = this.value ? this.value.slice(0, this.value.length - 1) : undefined;
      if (newValue) {
        this.value = !isEmpty(newValue) ? newValue : undefined;
      }
    }

    const shouldSkipKey =
      (this.allowedKeys instanceof RegExp && !e.key.match(this.allowedKeys)) ||
      (Array.isArray(this.allowedKeys) && !this.allowedKeys.includes(e.key));
    if (shouldSkipKey) {
      e.preventDefault();
    }
  };

  private deleteValue = (t: string | { label: string; value: string }) => {
    if (this.value) {
      const newValue = this.value.filter((v) => !isEqual(v, t)) as
        | string[]
        | { label: string; value: string }[];
      this.value = newValue.length === 0 ? undefined : newValue;
    }
  };

  private handleTagKeyDown = (e: KeyboardEvent, t: string | { label: string; value: string }) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.deleteValue(t);
      this.inputRef?.focus();
    }
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    if (this.typingAllowed === false) {
      return;
    }
    this.focused = true;
    const selectsEverything =
      this.value &&
      this.inputRef?.selectionStart === 0 &&
      this.value.toString().length === this.inputRef?.selectionEnd;
    setTimeout(() => {
      if (this.inputRef) {
        if (selectsEverything) {
          const value = this.inputRef?.value ? this.inputRef.value : '';
          return this.inputRef.setSelectionRange(0, value.toString().length);
        }
      }
    }, 0);
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
    if (this.shouldEmitChange) {
      this.shouldEmitChange = false;
      this.change.emit({ value: this.value });
    }
    if (this.inputRef && this.clearFilterOnBlur) {
      this.inputRef.value = '';
      this.filterValue = undefined;
    }
  };

  private handleNativeChange = () => {
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
  };

  private handleNativeInput = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
    this.filterValue =
      this.inputRef?.value && this.inputRef?.value !== '' ? this.inputRef.value : undefined;
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.input.emit({ value: this.value });
    this.handleChange(event);
    this.updateValidity();
  };

  private handleWrapperClick = (e: globalThis.Event) => {
    const isButton = (e.currentTarget as globalThis.Element).tagName
      .toLowerCase()
      .includes('button');
    if (isButton) {
      return;
    }
    this.inputRef?.focus();
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
          minHeight: this.height,
          flexShrink: this.width ? `0` : '',
        }}
      >
        <div
          part="tag-input-wrapper"
          class={{
            'br-tag-input-wrapper': true,
            'br-tag-input-was-touched': isTouched || this.active === true,
            'br-tag-input-focused': this.focused || this.active === true,
            'br-tag-input-disabled': this.disabled,
            'br-tag-input-readonly': this.readonly,
            'br-tag-input-invalid': isTouched && !this.internalValidityState.valid,
          }}
          style={{
            height: this.height,
          }}
          onClick={this.handleWrapperClick}
        >
          <slot name="left-icon"></slot>
          <div part="resizer" class="br-tag-input-content-resizer">
            <slot></slot>
            {this.value?.map((t) => {
              const isString = typeof t === 'string';
              const tagProps: {
                colorType: BaseColorType<ColorType>;
                fillStyle: FillStyle;
                size: Size;
              } = {
                colorType: 'Neutral',
                fillStyle: 'Ghost',
                size:
                  (this.size === 'Large' && 'Normal') || this.size === 'Normal'
                    ? 'Small'
                    : 'Xsmall',
                ...(isString ? {} : t.tagProps),
              };
              const label = isString ? t : t.label;

              return (
                <div
                  key={label}
                  style={{ display: 'contents' }}
                  {...{
                    onClear: () => this.deleteValue(t),
                  }}
                >
                  <slot name={`${label}-tag-content`}>
                    <br-tag
                      focusable={true}
                      {...tagProps}
                      showClearIcon={!this.readonly && !this.disabled}
                      onClear={(e) => {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        this.deleteValue(t);
                      }}
                      theme={this.theme}
                      ellipsis={true}
                      onKeyDown={(e) => this.handleTagKeyDown(e, t)}
                    >
                      <span>{label}</span>
                    </br-tag>
                  </slot>
                </div>
              );
            })}
            <div class="br-filter-value-wrapper">
              {((!this.readonly && !this.disabled) || !this.value) && (
                <input
                  class={{ 'has-value': this.filterValue !== undefined }}
                  disabled={this.disabled}
                  readonly={this.readonly || this.typingAllowed === false}
                  autoComplete="off"
                  autoFocus={this.autoFocus}
                  placeholder={!this.value ? this.placeholder : undefined}
                  name={this.name}
                  ref={(ref) => (this.inputRef = ref)}
                  size={undefined}
                  value={this.filterValue}
                  onBlur={this.handleNativeBlur}
                  onClick={this.handleNativeClick}
                  onFocus={this.handleNativeFocus}
                  onChange={this.handleNativeChange}
                  onInput={this.handleNativeInput}
                  onKeyDown={this.handleKeyDown}
                />
              )}
              <span class="br-filter-resizer">
                {this.filterValue
                  ? this.filterValue.replace(/ /g, '\u00a0')
                  : !this.value && this.placeholder?.replace(/ /g, '\u00a0')}
              </span>
            </div>
          </div>
          <slot name="tooltip-error">
            {this.errorDisplayType === 'tooltip' && renderInputError()}
          </slot>
          {this.showClearButton && !this.disabled && !this.readonly && (
            <br-button
              {...internalButtonProps}
              class="br-clear-value-button"
              onClick={(e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                this.inputRef?.focus({ preventScroll: true });
                this.clearValue();
              }}
              disabled={!this.value}
              size={this.size !== 'Small' ? 'Small' : 'Xsmall'}
            >
              <br-icon slot="left-icon" iconName="Cross" />
            </br-button>
          )}
          <slot name="right-icon"></slot>
        </div>
        <div class="br-tag-input-annotation-wrapper">
          <slot name="hint"></slot>
          <slot name="inline-error">
            {this.errorDisplayType === 'inline' && renderInputError()}
          </slot>
        </div>
      </Host>
    );
  }
}

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
  Fragment,
} from '@stencil/core';
import { CustomErrorMessages, CustomValidator, ErrorKey } from '../input/types/input-types';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { isEqual } from 'lodash-es';
import { BaseColorType, BaseSize, BaseSizes } from '../../reserved/editor-types';
import { DebugMode } from '../debug/types/utils';

// This id increments for all textareas on the page
let textareaId = 0;

/**
 * The Text Area component enables a user to enter information.
 * @category Inputs & Forms
 * @slot left-icon - Passes an icon to the Text Area.
 * @slot right-icon - Passes additional content to the Text Area.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 */
@Component({
  tag: 'br-text-area',
  styleUrl: './css/text-area.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class TextArea {
  /**
   * A reference to the native textarea element.
   */
  private textAreaRef: HTMLTextAreaElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTextAreaElement;
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
   * Stores whether the textarea has been touched for error states.
   */
  @State() wasTouched: boolean = false;
  /**
   * Whether the textarea is focused.
   */
  @State() focused: boolean = false;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-textarea-${textareaId++}`;
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
  @Prop({ mutable: true }) value: string | undefined;
  @Watch('value')
  handleValueChanged(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const newValueToApply = newValue !== undefined ? newValue.toString() : '';
      if (this.textAreaRef && this.textAreaRef.value !== newValueToApply) {
        this.textAreaRef.value = newValueToApply;
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
  @Prop() defaultValue?: string;
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
   * Determines whether the element should resize to fit the text.
   * @category Behavior
   */
  @Prop() resizeWithText?: true | 'horizontal' | 'vertical' = 'vertical';
  /**
   * Determines whether the element inserts a newline when the enter key is pressed.
   * @category Behavior
   */
  @Prop() insertNewline?: 'Enter' | 'Shift-Enter' | false = 'Shift-Enter';
  /**
   * New line character to use when insertNewline is enabled.
   * @category Behavior
   */
  @Prop() newlineCharacter: string = '\n';
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: string | undefined }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{ value: string | undefined }>;
  /**
   * Emits an event when the native HTML textarea event emits.
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
   * A method to clear the value of the textarea
   */
  @Method()
  async clearValue(): Promise<void> {
    if (!this.textAreaRef) {
      return;
    }
    this.wasTouched = true;
    this.value = undefined;
    this.textAreaRef.value = '';
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
    if (this.textAreaRef && !validity.valid && validity.firstError) {
      this.textAreaRef.setCustomValidity(validity.firstError);
    }
    const nativeErrorsBooleans =
      validity.nativeErrors && !isEqual(validity.nativeErrors, {})
        ? Object.entries(validity.nativeErrors).map((v) => [v[0], true])
        : {};
    this.internals?.setValidity(
      { ...nativeErrorsBooleans, customError: firstCustomError },
      validity.firstError,
      this.textAreaRef,
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
          `WARNING - This textarea is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
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
    if (!event.target || !this.textAreaRef) {
      return;
    }
    this.value = this.textAreaRef.value;
    this.internals?.setFormValue(this.textAreaRef.value !== '' ? this.textAreaRef.value : null);
  }

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
  };

  // Updates validity in the form context and the native textarea and stores the value in a retrievable state
  private updateValidity = () => {
    if (this.textAreaRef) {
      this.textAreaRef.setCustomValidity('');
      this.textAreaRef.checkValidity();
      const nativeValidity = this.textAreaRef.validity;
      const validationMessage = this.textAreaRef.validationMessage;
      this.internals?.setValidity(nativeValidity, validationMessage, this.textAreaRef);

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
          const invalid = v.isInvalid(this.textAreaRef?.value);
          if (invalid) {
            this.internals?.setValidity(
              { ...this.textAreaRef?.validity, customError: true },
              v.errorMessage,
              this.textAreaRef,
            );
            this.textAreaRef!.setCustomValidity(v.errorMessage);
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
    const shouldSubmit =
      (this.insertNewline === 'Shift-Enter' && e.key === 'Enter' && !e.shiftKey) ||
      !this.insertNewline;
    if (e.key === 'Enter' && shouldSubmit) {
      const parentForm = this.internals?.form;
      if (parentForm) {
        parentForm.requestSubmit();
      }
    }
    if (e.key === 'Enter') {
      if (this.insertNewline) {
        e.preventDefault();
        if (this.insertNewline === 'Shift-Enter' && e.shiftKey) {
          this.textAreaRef?.setRangeText(
            this.newlineCharacter,
            this.textAreaRef?.selectionStart,
            this.textAreaRef?.selectionEnd,
            'end',
          );
          this.value = this.textAreaRef?.value;
        } else if (this.insertNewline === 'Enter') {
          this.textAreaRef?.setRangeText(
            this.newlineCharacter,
            this.textAreaRef?.selectionStart,
            this.textAreaRef?.selectionEnd,
            'end',
          );
          this.value = this.textAreaRef?.value;
        }
      } else {
        e.preventDefault();
      }
    }

    const shouldSkipKey =
      (this.allowedKeys instanceof RegExp && !e.key.match(this.allowedKeys)) ||
      (Array.isArray(this.allowedKeys) && !this.allowedKeys.includes(e.key));
    if (shouldSkipKey) {
      e.preventDefault();
    }
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    this.focused = true;
    const selectsEverything =
      this.value &&
      this.textAreaRef?.selectionStart === 0 &&
      this.value.toString().length === this.textAreaRef?.selectionEnd;
    setTimeout(() => {
      if (this.textAreaRef) {
        if (this.caretOnFocus === 'selection') {
          return this.textAreaRef.select();
        }
        if (this.caretOnFocus === 'start') {
          return this.textAreaRef.setSelectionRange(0, 0);
        }
        if (selectsEverything) {
          const value = this.textAreaRef?.value ? this.textAreaRef.value : '';
          return this.textAreaRef.setSelectionRange(0, value.toString().length);
        }
      }
    }, 0);
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
  };

  private handleNativeChange = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
    this.change.emit({ value: this.textAreaRef?.value });
    this.handleChange(event);
  };

  private handleNativeInput = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.input.emit({ value: this.textAreaRef?.value });
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

    const resizeValue = (
      this.value?.toString().split('\n').join('<br>').replace(/ /g, '\u00a0') ||
      this.placeholder?.replace(/ /g, '\u00a0')
    )?.split('\u00a0');

    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <div
          class={{
            'br-textarea-wrapper': true,
            'br-textarea-was-touched': isTouched || this.active === true,
            'br-textarea-focused': this.focused || this.active === true,
            'br-textarea-disabled': this.disabled,
            'br-textarea-readonly': this.readonly,
            'br-textarea-invalid': isTouched && !this.internalValidityState.valid,
          }}
        >
          <slot name="left-icon"></slot>
          <div
            part="resizer"
            class={{
              'br-textarea-content-resizer': true,
              'br-resize-vertical':
                this.resizeWithText === true || this.resizeWithText === 'vertical',
              'br-resize-horizontal':
                this.resizeWithText === true || this.resizeWithText === 'horizontal',
            }}
          >
            <textarea
              cols={1}
              rows={1}
              disabled={this.disabled}
              readonly={this.readonly}
              autoFocus={this.autoFocus}
              autocomplete={this.autoComplete}
              placeholder={this.placeholder}
              name={this.name}
              ref={(ref) => (this.textAreaRef = ref)}
              required={this.required}
              value={this.value !== '' ? this.value : undefined}
              onBlur={this.handleNativeBlur}
              onClick={this.handleNativeClick}
              onFocus={this.handleNativeFocus}
              onChange={this.handleNativeChange}
              onInput={this.handleNativeInput}
              onKeyDown={this.handleKeyDown}
            />
            <span style={{ pointerEvents: 'none' }}>
              {resizeValue?.map((s, i) => {
                const split = s.split('<br>');
                return (
                  <Fragment>
                    <span class="inner-value">
                      {s.includes('<br>')
                        ? split.map((x) => {
                            return (
                              <Fragment>
                                {x}
                                <br />
                              </Fragment>
                            );
                          })
                        : s}
                    </span>
                    {i !== resizeValue.length - 1 && <span>{'\u00a0'}</span>}
                  </Fragment>
                );
              })}
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
              size={'Small'}
            >
              <br-icon slot="left-icon" iconName="Cross" />
            </br-button>
          )}
          <slot name="right-icon"></slot>
        </div>
        <div class="br-textarea-annotation-wrapper">
          <slot name="hint"></slot>
          <slot name="inline-error">
            {this.errorDisplayType === 'inline' && renderInputError()}
          </slot>
        </div>
      </Host>
    );
  }
}

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
import { CustomErrorMessages, CustomValidator } from '../input/types/input-types';
import { FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { isEmpty, isEqual } from 'lodash-es';
import { convertBytes, maxFileSizeErrorMessage } from './types/file-input-types';
import { CommonFileExtension, CommonFileTypes } from '../file-upload/types/file-upload-types';
import { DebugMode } from '../debug/types/utils';

// This id increments for all inputs on the page
let fileInputId = 0;

/**
 * The File Input component enables a user to attach files.
 * @category Inputs & Forms
 * @slot left-icon - Passes an icon to the Input.
 * @slot right-icon - Passes additional content to the Input.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 * @slot {{label}}-tag-content - Dynamic slot name that allows passing custom rendered content to each tag input element.
 * @slot browse-button
 * @slot browse-button-label
 */
@Component({
  tag: 'br-file-input',
  styleUrl: './css/file-input.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class FileInput {
  /**
   * A reference to the native input element.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * A reference to the tag input.
   */
  private tagInputRef: HTMLBrTagInputElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrFileInputElement;
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
  @Prop({ reflect: true }) readonly internalId: string = `br-file-input-${fileInputId++}`;
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
   */
  @Prop({ mutable: true }) value: File[] | undefined;
  @Watch('value')
  handleValueChanged(newValue: File[] | undefined, oldValue: File[] | undefined) {
    if (newValue !== oldValue) {
      this.wasTouched = true;
      const files = newValue;
      const formData = new FormData();
      if (!isEmpty(files)) {
        Array.from(files!).map((f) => {
          formData.append(this.name, f);
        });
      }
      this.internals?.setFormValue(formData);
      this.valueChange.emit({ value: newValue });
      this.updateValidity();
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue?: File[];
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
  @Prop() validations?: CustomValidator<File[] | undefined>[];
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
   * Determines if the clear affordance is displayed in the component.
   * @category Appearance
   * @visibility persistent
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
   * Determines if the component accepts multiple values.
   * @category Data
   * @visibility persistent
   */
  @Prop() multiple?: boolean;
  /**
   * Determines the max file size in bytes accepted by the component.
   * @category Data
   */
  @Prop() maxFileSize?: number;
  /**
   * Determines the file details displayed by the component.
   * @category Appearance
   */
  @Prop() fileDetails?: {
    name: 'file-name' | 'file-name-extension';
    size?: true | 'Mb' | 'Kb' | 'Gb' | 'b';
  };
  /**
   * Determines if the component displays a browse affordance.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) showBrowseButton?: boolean = true;
  /**
   * Determines the file types accepted by the component.
   * @category Data
   */
  @Prop() acceptedFileTypes: CommonFileExtension[] | CommonFileTypes[] | string[] = [];
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: File[] | undefined }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{ value: File[] | undefined }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  @Event({ cancelable: true }) input!: EventEmitter<{ value: File[] | undefined }>;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.inputRef as any).value = null;
    const formData = new FormData();
    this.internals?.setFormValue(formData);
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
    this.tagInputRef?.setInternalValidityState(validity);
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
      this.internals?.setFormValue(this.value !== undefined ? this.value.toString() : '');
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      const files = this.defaultValue;
      if (!files) {
        return;
      }
      const formData = new FormData();
      Array.from(files).map((f) => {
        formData.append(this.name, f);
      });
      this.internals?.setFormValue(formData);
    }
  }

  componentDidLoad() {
    if (this.internals?.form) {
      this.internals?.form.addEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
    this.updateValidity();
    setTimeout(() => {
      const isTouched =
        !this.invalidAfterTouch || this.wasTouched || this.controlledInternalValidityState === true;
      if (!isTouched) {
        return;
      }
      this.tagInputRef?.setInternalValidityState(this.internalValidityState);
    }, 0);
  }

  disconnectedCallback() {
    if (this.internals?.form) {
      this.internals?.form.removeEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
  }

  formResetCallback() {
    this.clearValue();
  }

  formStateRestoreCallback(state: File[] | undefined) {
    this.value = state;
  }

  private handleChange(event: globalThis.Event) {
    if (!event.target || !this.inputRef) {
      return;
    }
    const files = this.inputRef.files;
    const formData = new FormData();
    this.value = !isEmpty(files) ? Array.from(files!) : this.value;
    if (!isEmpty(files)) {
      Array.from(files!).map((f) => {
        formData.append(this.name, f);
      });
      this.internals?.setFormValue(formData);
    }
  }

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
    setTimeout(() => {
      this.tagInputRef?.setInternalValidityState(this.internalValidityState);
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

      if (this.required) {
        if (!this.value) {
          const errorMessage = CustomErrorMessages['valueMissing'];
          this.internals?.setValidity({ valueMissing: true }, errorMessage, this.inputRef);
          this.inputRef!.setCustomValidity(errorMessage);
          valid = false;
          nativeErrors['valueMissing'] = errorMessage;
        }
      }
      if (this.maxFileSize) {
        const files = this.value;
        const maxFileSize = this.maxFileSize;
        files?.forEach((f) => {
          if (f.size > maxFileSize) {
            valid = false;
            const valueToDisplay =
              (maxFileSize / (1024 * 102 * 1024) > 1 &&
                `${maxFileSize / (1024 * 1024 * 1024)} Gb`) ||
              (maxFileSize / (1024 * 1024) > 1 && `${maxFileSize / (1024 * 1024)} Mb`) ||
              (maxFileSize / 1024 > 1 && `${maxFileSize / 1024} Kb`) ||
              `${maxFileSize} b`;
            const errorMessage = maxFileSizeErrorMessage(valueToDisplay);
            this.internals?.setValidity(
              { ...this.inputRef?.validity, customError: true },
              errorMessage,
              this.inputRef,
            );
            this.inputRef!.setCustomValidity(errorMessage);
            valid = false;
            customErrors['maxFileSize'] = errorMessage;
          }
        });
      }
      if (this.validations) {
        this.validations.map((v) => {
          const files = this.value;
          const invalid = v.isInvalid(files);
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
  };

  private handleNativeClick = (e: globalThis.Event) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeFocus = () => {
    this.focused = true;
    this.wasTouched = true;
  };

  private handleNativeBlur = () => {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
  };

  private handleNativeChange = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
    this.change.emit({
      value: this.inputRef?.files ? Array.from(this.inputRef.files) : this.value,
    });
    this.handleChange(event);
  };

  private handleNativeInput = (event: globalThis.Event) => {
    this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
    event.stopImmediatePropagation();
    event.stopPropagation();
    const files = this.inputRef?.files;
    this.input.emit({ value: !isEmpty(files) ? Array.from(files!) : this.value });
    this.handleChange(event);
    this.updateValidity();
  };

  private getAcceptString = () => {
    let acceptString: string = '';
    this.acceptedFileTypes.forEach((a, i) => {
      if (a[0] === '.' || a.includes('/')) {
        acceptString = acceptString.concat(a);
      } else {
        acceptString = acceptString.concat(`.${a}`);
      }
      if (i !== this.acceptedFileTypes.length - 1 && this.acceptedFileTypes.length > 0) {
        acceptString = acceptString.concat(',');
      }
    });
    return acceptString;
  };

  private handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer;
    const files = data?.files;
    if (files) {
      const formData = new FormData();
      this.value = !isEmpty(files) ? Array.from(files!) : this.value;
      if (!isEmpty(files)) {
        Array.from(files!).map((f) => {
          formData.append(this.name, f);
        });
        this.internals?.setFormValue(formData);
      }
    }
  };

  render() {
    const tagValue = () => {
      const hasValue = this.value;
      if (hasValue) {
        const values = this.value?.map((t) => {
          return {
            label: t.name,
            value: t.name,
          };
        });
        return values;
      } else {
        return undefined;
      }
    };

    const preventInternalEvents = (e: globalThis.Event) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    };

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

    const acceptString = this.getAcceptString();

    return (
      <Host
        style={{
          width: this.width || (this.fullWidth ? '100%' : undefined),
          height: this.height || (this.fullHeight ? '100%' : undefined),
        }}
        onFocus={() => {
          this.wasTouched = true;
          this.tagInputRef?.setInternalValidityState(this.internalValidityState);
        }}
        onClick={() => {
          this.inputRef?.click();
        }}
        onDrop={this.handleDrop}
        onDragOver={(e: DragEvent) => e.preventDefault()}
      >
        <br-tag-input
          part="tag-input"
          createValueOnEnter={false}
          theme={this.theme}
          typingAllowed={false}
          width={this.width}
          height={this.height}
          fullHeight={this.fullHeight}
          fullWidth={this.fullWidth}
          ref={(ref) => (this.tagInputRef = ref)}
          placeholder={this.placeholder}
          value={tagValue()}
          size={this.size}
          shape={this.shape}
          fillStyle={this.fillStyle}
          showClearButton={this.showClearButton}
          invalidAfterTouch={this.invalidAfterTouch}
          disabled={this.disabled}
          readonly={this.readonly}
          errorDisplayType={this.errorDisplayType}
          onClick={(e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.inputRef?.click();
          }}
          onInvalid={() => {
            this.wasTouched = true;
          }}
          onValueChange={(e) => {
            preventInternalEvents(e);
            const isEmpty = e.detail.value === undefined;
            if (isEmpty) {
              this.clearValue();
            }
            setTimeout(() => {
              if (isTouched) {
                this.tagInputRef?.setInternalValidityState(this.internalValidityState);
              }
            }, 0);
          }}
          onChange={(e) => {
            preventInternalEvents(e);
          }}
          onInput={(e) => {
            preventInternalEvents(e);
          }}
        >
          <input
            name={this.name}
            accept={acceptString !== '' ? acceptString : undefined}
            multiple={this.multiple}
            placeholder={this.placeholder}
            ref={(ref) => (this.inputRef = ref)}
            required={this.required}
            type={'file'}
            onBlur={this.handleNativeBlur}
            onClick={this.handleNativeClick}
            onFocus={this.handleNativeFocus}
            onChange={this.handleNativeChange}
            onInput={this.handleNativeInput}
            onKeyDown={this.handleKeyDown}
          />
          <slot slot="left-icon" name="left-icon"></slot>
          {this.value?.map((t) => {
            const displayName =
              (this.fileDetails &&
                this.fileDetails.name === 'file-name' &&
                t.name.split('.').slice(0, -1).join('.')) ||
              t.name;
            const displaySize =
              this.fileDetails &&
              this.fileDetails.size &&
              ` - ${convertBytes(this.fileDetails.size === true ? 'b' : this.fileDetails.size, t.size)}${this.fileDetails.size !== true ? this.fileDetails.size : ''}`;
            const handleClear = () => {
              const newValue = this.value ? this.value.filter((f) => f.name !== t.name) : undefined;
              const valueToApply = !newValue || isEmpty(newValue) ? undefined : newValue;
              this.value = valueToApply;
            };
            return (
              <br-tag
                key={t.name}
                slot={`${t.name}-tag-content`}
                showClearIcon={true}
                colorType="Neutral"
                fillStyle="Ghost"
                size={
                  (this.size === 'Large' && 'Normal') || this.size === 'Normal' ? 'Small' : 'Xsmall'
                }
                onClick={(e) => {
                  preventInternalEvents(e);
                }}
                ellipsis={true}
                onClear={handleClear}
                theme={this.theme}
              >
                <span>{displayName}</span>
                {this.fileDetails && this.fileDetails.size && (
                  <span slot="right-icon">{displaySize}</span>
                )}
              </br-tag>
            );
          })}
          <slot slot="right-icon" name="right-icon"></slot>
          {this.showBrowseButton && (
            <slot slot="right-icon" name="browse-button">
              <br-button
                theme={this.theme}
                slot="right-icon"
                colorType="Neutral"
                fillStyle="Solid"
                class="br-browse-button"
                disabled={this.disabled || this.readonly}
                size={this.size !== 'Small' ? 'Small' : 'Xsmall'}
              >
                <slot name="browse-button-label">
                  <span>Browse</span>
                </slot>
              </br-button>
            </slot>
          )}
          <slot slot="tooltip-error" name="tooltip-error">
            {this.errorDisplayType === 'tooltip' && renderInputError()}
          </slot>
          <slot slot="hint" name="hint"></slot>
          <slot slot="inline-error" name="inline-error">
            {this.errorDisplayType === 'inline' && renderInputError()}
          </slot>
        </br-tag-input>
      </Host>
    );
  }
}

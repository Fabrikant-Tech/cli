import {
  Component,
  ComponentInterface,
  Element,
  h,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter,
  Listen,
  Method,
} from '@stencil/core';
import { CustomErrorMessages, ErrorKey } from '../input/types/input-types';
import { isEqual } from 'lodash-es';
import { FormCustomError, FormNativeError, FormValidity } from './types/form-types';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

// This id increments for all buttons on the page
let formId = 0;

/**
 * The Form component enables a user to submit information.
 * @category Inputs & Forms
 */
@Component({
  tag: 'br-form',
  styleUrl: 'css/form.css',
})
export class Form implements ComponentInterface {
  /**
   * A reference to the tooltip.
   */
  private tooltip: HTMLBrTooltipElement | undefined = undefined;
  /**
   * A reference to the toast.
   */
  private toast: HTMLBrToastElement | undefined = undefined;
  /**
   * A reference to the toast provider.
   */
  private toastProvider: HTMLBrToastProviderElement | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrFormElement;
  /**
   * Is toast open.
   */
  @State() isToastOpen: boolean = false;
  /**
   * Whether the form has loaded.
   */
  @State() hasLoaded: boolean = false;
  /**
   * Stores an internal validity state to use with the error message.
   */
  @State() internalValidityState: FormValidity = { valid: true };
  @Watch('internalValidityState')
  internalValidityStateChanged(newValue: FormValidity, oldValue: FormValidity) {
    if (!isEqual(newValue, oldValue) && this.hasLoaded) {
      this.formValidityChange.emit(this.internalValidityState);
      if (this.isToastOpen) {
        this.generateErrorAffordance();
      }
    }
  }
  /**
   * * Defines the theme of the component.
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
  @Prop({ reflect: true }) readonly internalId: string = `br-form-${formId++}`;
  /**
   * Determines whether an error message should be displayed and if yes which type.
   * @category Appearance
   */
  @Prop() errorDisplayType: 'toast' | 'tooltip' | undefined = 'tooltip';
  /**
   * Determines if the component focuses the first error on submit.
   * @category Behavior
   */
  @Prop() focusOnError: boolean = true;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * An event that emits when the form validity state changes.
   */
  @Event() formValidityChange: EventEmitter<FormValidity>;
  /**
   * An event that emits when the form is submitted. The detail contains the native form event enabling both custom and default
   * form submission behavior.
   */
  @Event() formSubmission: EventEmitter<globalThis.Event>;
  /**
   * A method to get the validity state of the form.
   */
  @Method()
  async getInternalValidityState(): Promise<FormValidity> {
    this.getAllErrors();
    return this.internalValidityState;
  }

  private internalGetBoundingClientRect() {
    return this.elm?.querySelector('form')?.getBoundingClientRect();
  }

  componentWillLoad(): void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    this.getAllErrors();
  }

  componentDidLoad(): void {
    this.hasLoaded = true;
  }

  @Listen('input')
  handleInput() {
    this.getAllErrors();
  }

  @Listen('change')
  handleChange() {
    this.getAllErrors();
  }

  @Listen('valueChange')
  handleValueChange() {
    this.getAllErrors();
  }

  @Listen('validityChange')
  handleValidityChange() {
    this.getAllErrors();
  }

  private getAllErrors = async () => {
    const fields = this.elm.querySelectorAll('*[name]');
    const getValidity = async (fields: NodeListOf<Element>) => {
      const validity: {
        [key: string]: FormCustomError | FormNativeError;
      } = {};
      await Promise.all(
        Array.from(fields).map(async (field) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fieldError: { [key: string]: any } = {};
          const fieldValidity =
            (field as HTMLInputElement).validity ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (await (field as any).getInternalValidityState());
          if (fieldValidity.valid) {
            return;
          }
          if (
            (field as HTMLInputElement).validity &&
            !(field as HTMLInputElement).validity?.valid
          ) {
            for (const key in (field as HTMLInputElement).validity) {
              const k = key as Exclude<ErrorKey, 'valid'>;
              const activeError = (field as HTMLInputElement).validity[k] && k !== 'customError';
              if (activeError) {
                fieldError['valid'] = false;
                fieldError['error'] = CustomErrorMessages[k];
              }
            }
          }
          validity[(field as HTMLInputElement).name] =
            Object.keys(fieldError).length > 0
              ? { type: 'native', ...fieldError }
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ({ type: 'custom', ...fieldValidity } as any);
        }),
      );
      return validity;
    };

    const errors = await getValidity(fields);
    this.internalValidityState = {
      valid: isEqual(errors, {}),
      errors: isEqual(errors, {}) ? undefined : errors,
    };
  };

  private getNameForField = (name: string) => {
    const fieldElement = this.elm.querySelector(`*[name='${name}']`);
    const fieldWrapper = fieldElement?.closest('br-field');
    const fieldLabel = fieldWrapper?.querySelector('br-field-label')?.textContent || name;
    return fieldLabel;
  };

  private findOrCreateToastProvider = () => {
    const existingToastProvider = document.querySelector('br-toast-provider');
    const providerToUse = existingToastProvider || document.createElement('br-toast-provider');
    if (!existingToastProvider) {
      this.elm.parentElement?.appendChild(providerToUse);
    }
    this.toastProvider = providerToUse;
  };

  private handleSubmit = async (e: Event) => {
    const clonedToastId = `form-errors-${this.internalId}-clone`;
    const clonedToast = this.toastProvider?.querySelector(`*[id="${clonedToastId}"]`);
    if (clonedToast) {
      clonedToast.remove();
    }
    if (this.internalValidityState.valid) {
      this.formSubmission.emit(e);
    }
    if (e && !this.internalValidityState.valid) {
      e.preventDefault();
    }
    await this.getAllErrors();
    if (!this.internalValidityState.valid) {
      const firstElement =
        this.internalValidityState.errors && Object.keys(this.internalValidityState.errors)[0];
      if (firstElement && this.focusOnError) {
        const firstDOMElement = this.elm.querySelector(`*[name="${firstElement}"]`);
        firstDOMElement?.scrollIntoView();
        (firstDOMElement as HTMLElement)?.focus();
      }
      return setTimeout(() => this.generateErrorAffordance(), 0);
    }
  };

  private generateErrorAffordance = () => {
    if (this.errorDisplayType === 'toast') {
      return this.generateErrorToast();
    }
    if (this.errorDisplayType === 'tooltip') {
      return this.generateErrorTooltip();
    }
  };

  private generateErrorTooltip = () => {
    const firstElement =
      this.internalValidityState.errors && Object.keys(this.internalValidityState.errors)[0];
    const element = this.elm.querySelector(`*[name="${firstElement}"]`);
    if (element) {
      this.tooltip?.closeElement();
      setTimeout(() => {
        this.tooltip?.openElement(element);
      }, 0);
    }
  };

  private generateErrorToast = () => {
    if (!this.toastProvider) {
      this.findOrCreateToastProvider();
    }

    if (!this.toast) {
      return;
    }

    const toastCopyId = `form-errors-${this.internalId}-clone`;
    const existingToast = this.toastProvider?.querySelector(
      `*[id="${toastCopyId}"]`,
    ) as HTMLBrToastElement;
    if (existingToast) {
      existingToast?.closeElement();
      existingToast?.remove();
    }

    setTimeout(() => {
      if (this.toast) {
        const clonedToast = this.toast.cloneNode(true) as HTMLBrToastElement;
        clonedToast.id = toastCopyId;
        clonedToast.expiration = 'none';
        clonedToast.addEventListener('open', this.handleToastOpen);
        clonedToast.addEventListener('close', this.handleToastClose);
        this.toastProvider?.appendChild(clonedToast);
      }
    }, 0);
  };

  private handleToastOpen = () => {
    this.isToastOpen = true;
  };

  private handleToastClose = () => {
    const clonedToastId = `form-errors-${this.internalId}-clone`;
    const clonedToast = this.toastProvider?.querySelector(`*[id="${clonedToastId}"]`);
    if (clonedToast) {
      clonedToast.remove();
    }
    this.isToastOpen = false;
  };

  render() {
    const length = this.internalValidityState.errors
      ? Object.keys(this.internalValidityState.errors).length
      : 0;
    const getErrorObject = () => {
      const errors: { [key: string]: string } = {};
      Object.entries(this.internalValidityState.errors || {}).forEach(([key, value]) => {
        const nativeMessage = value.type === 'native' ? value.error : undefined;
        const customMessage = value.type === 'custom' ? value.firstError : undefined;
        const message = customMessage || nativeMessage;
        errors[key] = message || 'Unknown error';
      });
      return errors;
    };
    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <slot></slot>
        {this.internalValidityState &&
          this.internalValidityState.valid === false &&
          this.errorDisplayType === 'tooltip' && (
            <br-tooltip
              color={'Destructive'}
              theme={this.theme}
              interaction="click"
              ref={(ref) => (this.tooltip = ref)}
              flip={true}
              onOpen={() => {
                setTimeout(() => {
                  this.tooltip?.closeElement();
                }, 3000);
              }}
            >
              <br-tooltip-content theme={this.theme} class="br-form-error-tooltip-content">
                <br-icon iconName="TriangleExclamationMark" size={24} color="White" />
                {Object.entries(getErrorObject()).map((error, i) => {
                  if (i === 0) {
                    return <span>{`${error[1]}`}</span>;
                  }
                })}
              </br-tooltip-content>
            </br-tooltip>
          )}
        {this.internalValidityState &&
          this.internalValidityState.valid === false &&
          this.errorDisplayType === 'toast' && (
            <br-toast
              id={`form-errors-${this.internalId}`}
              ref={(ref) => (this.toast = ref)}
              class="br-form-toast-visibility"
              expiration={'none'}
              fillStyle="Solid"
              colorType="Destructive"
              theme={this.theme}
            >
              <span slot="title">This form has {length} errors</span>
              <br-icon iconName="TriangleExclamationMark" slot="icon" />
              <ul>
                {Object.entries(getErrorObject()).map(([key, value]) => {
                  return <li>{`${this.getNameForField(key)}: ${value}`}</li>;
                })}
              </ul>
            </br-toast>
          )}
      </form>
    );
  }
}

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { CustomErrorMessages, CustomValidator, ErrorKey } from '../input/types/input-types';
import { isEqual, uniq } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

// This id increments for all inputs on the page
let sliderId = 0;

/**
 * The Slider component displays a linear range of numbers on a slider track. A user can select one or multiple values, depending on props, by moving a slider thumb along the track.
 * @category Inputs & Forms
 * @slot - Passes the slider thumb and slider track.
 * @slot error-message - Passes a custom error message when validation fails.
 * @slot inline-error - Passes a custom inline error message.
 * @slot hint - Passes an inline hint message.
 * @slot legend - Passes content to display as the legend.
 */
@Component({
  tag: 'br-slider',
  styleUrl: './css/slider.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class Slider {
  /**
   * A reference to the internal input.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the slider element.
   */
  @Element() elm: HTMLBrSliderElement;
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
   * Defines the data validations that apply to this component.
   * @category Data
   * @visibility advanced
   */
  @Prop() validations?: CustomValidator<{ [key: string]: number | number[] }>[];
  /**
   * Defines whether the component should display an invalid state after an event and/or a specific event.
   * @category Data
   */
  @Prop() invalidAfterTouch: 'click' | 'change' | 'input' | 'blur' | boolean = 'input';
  /**
   * Determines whether an error message should be displayed and if yes which type.
   * @category Appearance
   */
  @Prop() errorDisplayType: 'inline' | false = 'inline';
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-slider-${sliderId++}`;
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
   * Determines the minimum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() min: number = 0;
  /**
   * Determines the maximum value for the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() max: number = 100;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled: boolean;
  @Watch('disabled')
  disabledChanged(newValue: boolean, oldValue: boolean) {
    if (!isEqual(newValue, oldValue)) {
      this.updateDisabledState();
    }
  }
  /**
   * Determines the increment value when the user presses the stepper key.
   * @category Behavior
   */
  @Prop() step: number = 1;
  /**
   * Determines the increment value when the user presses the stepper key and holds the shift key.
   * @category Behavior
   */
  @Prop() largeStep: number = 10;
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop({ mutable: true }) value: { [key: string]: number | number[] };
  @Watch('value')
  handleValueChanged(
    newValue: { [key: string]: number | number[] },
    oldValue: { [key: string]: number | number[] },
  ) {
    const formData = this.getFormValueFromValue(newValue);
    if (!isEqual(newValue, oldValue)) {
      this.wasTouched = true;
      this.internals?.setFormValue(formData);
      this.valueChange.emit({ value: newValue });
      this.applyValuesOnThumbs();
      this.applyValuesOnTracks();
      this.updateValidity();
    }
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  @Prop() defaultValue: { [key: string]: number | number[] };
  /**
   * Defines the name associated with this component in the context of a form.
   * @category Data
   */
  @Prop({ reflect: true }) name?: string;
  /**
   * Determines the orientation of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) orientation?: 'horizontal' | 'vertical' = 'horizontal';
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
  @Prop() width?: BaseSize<BaseSizes> =
    this.orientation === 'horizontal' && !this.width ? '100%' : undefined;
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
  @Prop() height?: BaseSize<BaseSizes> =
    this.orientation === 'vertical' && !this.height ? '100%' : undefined;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{
    value: { [key: string]: number | number[] };
  }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  @Event({ cancelable: true }) change!: EventEmitter<{
    value: { [key: string]: number | number[] } | undefined;
  }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  @Event({ cancelable: true }) input!: EventEmitter<{
    value: { [key: string]: number | number[] } | undefined;
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
    this.value = this.getValueFromUndefined();
    this.applyValuesOnThumbs();
    this.applyValuesOnTracks();
    this.inputRef.value = '';
    const formValue = this.getFormValueFromValue(this.value);
    this.internals?.setFormValue(formValue);
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

  formResetCallback() {
    this.clearValue();
  }

  formStateRestoreCallback(state: { [key: string]: number | number[] }) {
    this.value = state;
  }

  private internalFocusOverride = (options?: FocusOptions): void => {
    const thumbs = this.getThumbsFromParent();
    thumbs[0]?.focus({ preventScroll: true, ...(options || {}) });
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
      const formData = this.getFormValueFromValue(this.value);
      this.internals?.setFormValue(formData);
    }
    // WHY Because a reflected prop and attribute can conflict and in certain situations
    // React will not be able to correctly determine the name.
    if (this.name) {
      this.elm.setAttribute('name', this.name);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      const formData = this.getFormValueFromValue(this.defaultValue);
      this.internals?.setFormValue(formData);
    }
    this.updateDisabledState();
    this.applyValuesOnThumbs();
    this.applyValuesOnTracks();
  }

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
  }

  private getThumbsFromParent = () => {
    const thumbs = Array.from(this.elm.querySelectorAll('br-slider-thumb'));
    return thumbs;
  };

  private applyValuesOnThumbs = () => {
    Object.entries(this.value).map((et) => {
      const rangeName = et[0];
      const value = et[1];
      const thumbs = this.getThumbsFromParent();
      const thumbsForRange = thumbs.filter((t) => t.rangeName === rangeName);
      const isSingleThumb = thumbsForRange.length === 1;
      if (isSingleThumb && typeof value === 'number') {
        thumbsForRange[0].value = value;
      } else {
        if (Array.isArray(value)) {
          const minThumb = thumbsForRange.find((t) => t.position === 'min');
          const maxThumb = thumbsForRange.find((t) => t.position === 'max');
          if (minThumb && maxThumb) {
            minThumb.value = value[0];
            maxThumb.value = value[1];
          }
        }
      }
    });
  };

  private applyValuesOnTracks = () => {
    const tracks = Array.from(this.elm.querySelectorAll('br-slider-track'));
    tracks.map((tr) => {
      tr.value = this.value;
    });
  };

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

  private getFormValueFromValue = (value?: { [key: string]: number | number[] }) => {
    const values = value || this.value;
    const formData = new FormData();
    const thumbs = this.getThumbsFromParent();
    const multipleRanges = uniq(thumbs.map((t) => t.rangeName)).length > 1;
    Object.entries(values).forEach((ve) => {
      const rangeName = ve[0];
      const v = ve[1];
      const composedKey = `${this.name}${multipleRanges ? `-${rangeName}` : ''}`;
      if (Array.isArray(v)) {
        formData.append(`${composedKey}`, v[0].toString());
        formData.append(`${composedKey}`, v[1].toString());
      } else {
        formData.append(`${composedKey}`, v.toString());
      }
    });
    return formData;
  };

  private getValueFromUndefined = () => {
    const thumbs = this.getThumbsFromParent();
    const undefinedValue: { [key: string]: number | number[] } = {};
    const rangesAndThumbs: { [key: string]: HTMLBrSliderThumbElement[] } = {};
    thumbs.map((t) => {
      rangesAndThumbs[t.rangeName] = [...(rangesAndThumbs[t.rangeName] || []), t];
    });
    Object.entries(rangesAndThumbs).map((r) => {
      const rName = r[0];
      const minThumb = r[1].find((t) => t.position === 'min');
      const maxThumb = r[1].find((t) => t.position === 'max');
      if (maxThumb && minThumb) {
        undefinedValue[rName] = [minThumb?.min, maxThumb?.max];
      } else if (minThumb) {
        undefinedValue[rName] = minThumb?.min;
      }
    });
    return undefinedValue;
  };

  private handleApplyValueBasedOnClick = (e: MouseEvent) => {
    if (!this.disabled) {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() !== 'br-slider-thumb') {
        const clickCoordinate = this.orientation === 'horizontal' ? e.clientX : e.clientY;
        let shortestDistance: number;
        let shortestDistanceThumb: HTMLBrSliderThumbElement | undefined;
        const thumbs = this.elm.querySelectorAll('br-slider-thumb');
        thumbs.forEach((thumb) => {
          const thumbEdge =
            this.orientation === 'horizontal'
              ? thumb.getBoundingClientRect().left
              : thumb.getBoundingClientRect().top;
          const distance =
            clickCoordinate > thumbEdge ? clickCoordinate - thumbEdge : thumbEdge - clickCoordinate;
          if (!shortestDistance) {
            shortestDistance = distance;
            shortestDistanceThumb = thumb;
          } else if (shortestDistance > distance) {
            shortestDistance = distance;
            shortestDistanceThumb = thumb;
          } else if (shortestDistance === distance) {
            if (clickCoordinate > thumbEdge) {
              shortestDistanceThumb = thumb;
            }
          }
        });
        shortestDistanceThumb?.moveToCoordinate(clickCoordinate);
      }
    }
  };

  private handleNativeClick = (e: MouseEvent) => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
    this.handleApplyValueBasedOnClick(e);
  };

  private updateDisabledState = () => {
    const thumbs = this.elm.querySelectorAll('br-slider-thumb');
    const tracks = this.elm.querySelectorAll('br-slider-track');
    thumbs.forEach((thumb) => (thumb.disabled = this.disabled));
    tracks.forEach((track) => (track.disabled = this.disabled));
  };

  @Listen('focus')
  handleInternalFocus() {
    this.focused = true;
  }

  @Listen('blur')
  handleInternalBlur() {
    this.wasTouched = this.invalidAfterTouch === 'blur' || this.wasTouched;
    this.focused = false;
  }

  @Listen('valueChange')
  handleThumbValueChange(e: CustomEvent<{ value: number }>) {
    const target = e.target as HTMLBrSliderThumbElement;
    if (target.tagName.toLowerCase() !== 'br-slider') {
      this.wasTouched = this.invalidAfterTouch === 'input' || this.wasTouched;
      this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
      e.stopImmediatePropagation();
      e.stopPropagation();

      const value = e.detail.value;

      const isMin = target.position === 'min';
      const pairedThumb = this.getThumbsFromParent().find(
        (t) => t.rangeName === target.rangeName && t.position !== target.position,
      );
      if (pairedThumb) {
        this.value = {
          ...(this.value || {}),
          [`${target.rangeName}`]: [
            isMin ? value : pairedThumb.value,
            !isMin ? value : pairedThumb.value,
          ],
        };
      } else {
        this.value = {
          ...(this.value || {}),
          [`${target.rangeName}`]: value,
        };
      }
    }
  }

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
      <Host
        onClick={this.handleNativeClick}
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <div
          class="br-slider-control-legend-wrapper"
          style={{
            height: this.height,
            width: this.width,
          }}
        >
          <div class="br-slider-control-wrapper">
            <div class="br-slider-wrapper">
              <input ref={(ref) => (this.inputRef = ref)} size={undefined} />
              <slot></slot>
            </div>
            <div class="br-slider-control-ghost" />
          </div>
          <slot name="legend"></slot>
        </div>
        <div class="br-slider-annotation-wrapper">
          <slot name="hint"></slot>
          <slot name="inline-error">
            {this.errorDisplayType === 'inline' && renderInputError()}
          </slot>
        </div>
      </Host>
    );
  }
}

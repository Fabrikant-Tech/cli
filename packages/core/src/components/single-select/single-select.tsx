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
import { isEqual } from 'lodash-es';
import { Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { CustomErrorMessages, CustomValidator } from '../input/types/input-types';
import { DebugMode } from '../debug/types/utils';

// This id increments for all select lists on the page
let singleSelectId = 0;

/**
 * The Select component is a dropdown list of items. Users can pick one item from the list.
 * @category Inputs & Forms
 * @slot - Passes the popover, button, popover-content, select-list and the select-list-item to the single select.
 * @slot inline-error - Passes a custom error display inline.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 */
@Component({
  tag: 'br-single-select',
  styleUrl: './css/single-select.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class SingleSelect {
  /**
   * A reference to the popover in the single select.
   */
  private popoverRef: HTMLBrPopoverElement | null;
  /**
   * A reference to the popover content in the single select.
   */
  private popoverContentRef: HTMLBrPopoverContentElement | null;
  /**
   * A reference to the popover in the single select.
   */
  private targetRef: HTMLBrButtonElement | null;
  /**
   * A reference to the popover in the single select.
   */
  private listRef: HTMLBrSelectListElement | null;
  /**
   * A reference to the popover in the single select.
   */
  private selectValueRef: HTMLBrSingleSelectValueElement | null;
  /**
   * A reference to the popover in the single select.
   */
  private selectValueIconRef: HTMLBrSingleSelectIconElement | null;
  /**
   * A reference to the native input element internally.
   */
  private inputRef: HTMLInputElement | undefined;
  /**
   * Whether the validity state is controlled.
   */
  private controlledInternalValidityState: boolean | undefined = undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSingleSelectElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Whether the list is focused.
   */
  @State() focused: boolean = false;
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
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-single-select-${singleSelectId++}`;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop({ mutable: true }) value: any[] | undefined;
  @Watch('value')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleValueChanged(newValue: any[] | undefined, oldValue: any[] | undefined) {
    const formData = new FormData();
    if (!isEqual(newValue, oldValue)) {
      if (this.listRef && !isEqual(this.listRef.value, newValue)) {
        this.listRef.value = newValue;
        const itemValue = newValue ? newValue[0] : undefined;
        const items = this.popoverContentRef?.querySelectorAll('br-select-list-item');
        const itemsToUse = items ? Array.from(items) : [];
        const item = itemValue ? itemsToUse.find((it) => isEqual(it.value, itemValue)) : undefined;
        const label = item?.label || item?.textContent || (newValue && newValue[0]) || undefined;
        if (this.selectValueRef) {
          this.selectValueRef.value = label;
        }
        if (this.selectValueIconRef) {
          this.selectValueIconRef.value = newValue;
        }
      }
      this.wasTouched = true;
      newValue?.map((v) => {
        formData.append(this.name, v);
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
  @Prop() defaultValue?: any[];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() validations?: CustomValidator<any[] | undefined>[];
  /**
   * Defines whether the component should display an invalid state after an event and/or a specific event.
   * @category Data
   */
  @Prop() invalidAfterTouch: 'click' | 'change' | 'blur' | boolean = 'click';
  /**
   * Determines if the component is required in a form context.
   * @category Data
   */
  @Prop() required?: boolean;
  /**
   * Determines whether an error message should be displayed and if yes which type.
   * @category Appearance
   */
  @Prop() errorDisplayType: 'inline' | false = 'inline';
  /**
   * Determines whether the component focuses an item as the user types.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() typeahead?: boolean = true;
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
   * Determines if a previously selected value is deselected when the user selects it again.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() selectingSameValueDeselects: boolean = true;
  /**
   * Determines if the component closes the popover when a user selects an item.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() shouldCloseOnSelect: boolean = true;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: any[] | undefined }>;
  /**
   * Emits an event when the native HTML change event emits.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event({ cancelable: true }) change!: EventEmitter<{ value: any[] | undefined }>;
  /**
   * Emits an event when the native HTML input event emits.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event({ cancelable: true }) input!: EventEmitter<{ value: any[] | undefined }>;
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
    if (!this.elm) {
      return;
    }
    this.wasTouched = true;
    this.value = undefined;
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
  /**
   * Get the items in the select.
   */
  @Method()
  async getItems(): Promise<HTMLBrSelectListItemElement[]> {
    const items = this.popoverContentRef?.querySelectorAll('br-select-list-item');
    if (items) {
      return Array.from(items);
    }
    return [];
  }

  private internalFocusOverride = (options?: FocusOptions): void => {
    this.targetRef?.focus({ preventScroll: true, ...(options || {}) });
  };

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  componentWillLoad() {
    const hasPopover = this.elm.querySelector(':scope br-popover');
    const hasDebugger = this.elm.closest('br-debug-wrapper');
    if (!hasPopover && DebugMode.currentDebug && hasDebugger) {
      console.error(`ERROR - The select popover is missing.`, this.elm);
    }
    const hasPopoverContent = hasPopover
      ? hasPopover.querySelector('br-popover-content')
      : undefined;
    if (!hasPopoverContent && DebugMode.currentDebug && hasDebugger) {
      console.error(`ERROR - The select popover content is missing.`, this.elm);
    }

    const hasTarget = this.elm.querySelector(':scope *[slot="target"]');
    if (!hasTarget && DebugMode.currentDebug && hasDebugger) {
      console.error(`ERROR - The select target is missing.`, this.elm);
    }
    if (hasTarget?.tagName.toLowerCase() !== 'br-button' && DebugMode.currentDebug && hasDebugger) {
      console.error(`ERROR - The target element must be a button.`, this.elm);
    }

    const hasList = hasPopoverContent
      ? hasPopoverContent.querySelector('br-select-list')
      : undefined;
    if (!hasList && DebugMode.currentDebug && hasDebugger) {
      console.error(`ERROR - The select list is missing.`, this.elm);
    }

    this.targetRef = hasTarget as HTMLBrButtonElement;
    this.targetRef.role = 'combobox';
    this.targetRef.ariaExpanded = 'false';

    if (this.targetRef) {
      this.elm.shape = this.targetRef.shape;
      this.elm.size = this.targetRef.size;
      this.elm.fullWidth = this.targetRef.fullWidth;
      this.elm.fullHeight = this.targetRef.fullHeight;
      this.elm.width = this.targetRef.width;
      this.elm.height = this.targetRef.height;
    }

    this.popoverRef = hasPopover as HTMLBrPopoverElement;
    this.popoverRef.showArrow = false;
    this.popoverRef.placement = 'bottom-start';
    this.popoverRef.focusContentOnOpen = true;
    this.popoverRef.focusTargetOnClose = true;
    if (this.popoverRef.minWidth === undefined) {
      this.popoverRef.minWidth = 'reference';
    }

    this.popoverContentRef = hasPopoverContent as HTMLBrPopoverContentElement;

    this.listRef = hasList as HTMLBrSelectListElement;
    this.listRef.multiple = false;
    this.listRef.hideStates = true;
    this.listRef.selectingSameValueDeselects = this.selectingSameValueDeselects;

    this.selectValueRef = this.elm.querySelector('br-single-select-value');
    this.selectValueIconRef = this.elm.querySelector('br-single-select-icon');

    if (this.selectValueRef) {
      this.selectValueRef.placeholder = 'Select something...';
    }

    if (this.value !== undefined) {
      if (DebugMode.currentDebug) {
        console.error(
          `WARNING - This input is in controlled mode. While the value will update visually you need to make sure your application implements a change handler.`,
          this.elm,
        );
      }
      const formData = new FormData();
      this.value?.map((v) => {
        formData.append(this.name, v);
      });
      this.internals?.setFormValue(formData);
      this.listRef.value = this.value;
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
        formData.append(this.name, v);
      });
      this.internals?.setFormValue(formData);
      this.listRef.value = this.defaultValue;
    }
    if (this.selectValueRef) {
      const itemValue = this.value ? this.value[0] : undefined;
      const items = this.popoverContentRef?.querySelectorAll('br-select-list-item');
      const itemsToUse = items ? Array.from(items) : [];
      const item = itemValue ? itemsToUse.find((it) => isEqual(it.value, itemValue)) : undefined;
      const label = item?.label || item?.textContent || undefined;
      this.selectValueRef.value = label;
    }
    if (this.selectValueIconRef) {
      this.selectValueIconRef.value = this.value ? this.value[0] : undefined;
    }
  }

  componentDidLoad() {
    this.elm.focus = this.internalFocusOverride.bind(this);
    if (this.internals?.form) {
      this.internals?.form.addEventListener('invalid', this.updateTouchOnFormSubmission, true);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formStateRestoreCallback(state: any[] | undefined) {
    this.value = state ? [state[0]] : undefined;
  }

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
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

      if (this.required) {
        if (!this.value) {
          const errorMessage = CustomErrorMessages['valueMissing'];
          this.internals?.setValidity({ valueMissing: true }, errorMessage, this.inputRef);
          valid = false;
          nativeErrors['valueMissing'] = errorMessage;
        }
      }
      if (this.validations) {
        this.validations.map((v) => {
          const invalid = v.isInvalid(this.elm?.value);
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

  private handleListKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      this.popoverRef?.closeElement();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleListValueChange = (e: CustomEvent<{ value: any[] | undefined }>) => {
    this.value = e.detail.value;
    const itemValue = e.detail.value ? e.detail.value[0] : undefined;
    const items = this.popoverContentRef?.querySelectorAll('br-select-list-item');
    const itemsToUse = items ? Array.from(items) : [];
    const item = itemValue ? itemsToUse.find((it) => isEqual(it.value, itemValue)) : undefined;
    const label = item?.label || item?.textContent || undefined;
    if (this.selectValueRef) {
      this.selectValueRef.value = label;
    }
    if (this.selectValueIconRef) {
      this.selectValueIconRef.value = this.value ? this.value[0] : undefined;
    }
    if (this.shouldCloseOnSelect || this.shouldCloseOnSelect === undefined) {
      this.popoverRef?.closeElement();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleListChange = (e: CustomEvent<{ value: any[] | undefined }>) => {
    this.change.emit({ value: e.detail.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleListInput = (e: CustomEvent<{ value: any[] | undefined }>) => {
    this.input.emit({ value: e.detail.value });
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  @Listen('open')
  handleOpenPopover() {
    setTimeout(() => {
      this.listRef?.focus({ preventScroll: true });
    }, 0);
    this.listRef?.addEventListener('valueChange', this.handleListValueChange);
    this.listRef?.addEventListener('change', this.handleListChange);
    this.listRef?.addEventListener('input', this.handleListInput);
    this.listRef?.addEventListener('keydown', this.handleListKeyDown);
    if (this.targetRef) {
      this.targetRef.ariaExpanded = 'true';
    }
  }

  @Listen('close')
  handleClosePopover() {
    this.listRef?.removeEventListener('valueChange', this.handleListValueChange);
    this.listRef?.removeEventListener('change', this.handleListChange);
    this.listRef?.removeEventListener('input', this.handleListInput);
    this.listRef?.removeEventListener('keydown', this.handleListKeyDown);
    if (this.targetRef) {
      this.targetRef.ariaExpanded = 'true';
    }
  }

  @Listen('keydown')
  handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.targetRef?.click();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      return this.clearValue();
    }
    if (!this.popoverRef?.isOpen && e.key.length === 1) {
      this.targetRef?.click();
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
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <div class="br-single-select-wrapper" onClick={this.handleNativeClick}>
          <input ref={(ref) => (this.inputRef = ref)} tabindex={-1} />
          <slot></slot>
        </div>
        <slot name="hint"></slot>
        <slot name="inline-error">{renderInputError()}</slot>
      </Host>
    );
  }
}

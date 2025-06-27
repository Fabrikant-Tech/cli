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
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';
import { CustomErrorMessages, CustomValidator } from '../../components/input/types/input-types';
import { similarityRatio } from './utils/utils';
import { isElementVisible } from '../../utils/utils';
import { DebugMode } from '../debug/types/utils';

// This id increments for all select lists on the page
let selectListId = 0;

/**
 * The List component is an interactive element that enables users to select one or many options from a set of items. Each of the items is its own list item component. You can customize the look and feel of the List with props.
 * @category Inputs & Forms
 * @slot - Passes the items to the List.
 * @slot inline-error - Passes a custom error display inline.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot hint - Enables passing a custom hint display.
 * @slot empty-filtered-state - Enables passing a custom display for when there are no options to display.
 */
@Component({
  tag: 'br-select-list',
  styleUrl: './css/select-list.css',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class SelectList {
  /**
   * A timeout that tracks when a typeahead value change happens.
   */
  private typeaheadTimeout: ReturnType<typeof setTimeout>;
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
  @Element() elm: HTMLBrSelectListElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyDirection: 'backward' | 'forward' | null;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyElement: HTMLBrSelectListItemElement | null;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyElementActiveState: boolean;
  /**
   * Whether the list is focused.
   */
  @State() focused: boolean = false;
  /**
   * Tracks the hovered element with arrows.
   */
  @State() hoveredElement: HTMLBrSelectListItemElement | null;
  @Watch('hoveredElement')
  handleHoveredElementChange(
    newValue: HTMLBrSelectListItemElement | null,
    oldValue: HTMLBrSelectListItemElement | null,
  ) {
    if (!isEqual(newValue, oldValue)) {
      if (oldValue) {
        oldValue.keyboardSelected = false;
      }
      if (newValue) {
        const isVisible = isElementVisible(newValue);
        if (!isVisible) {
          newValue.scrollIntoView({ behavior: 'instant' });
        }
        newValue.keyboardSelected = true;
      }
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
   * Stores a typed value to support typeahead.
   */
  @State() typeaheadString?: string;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-select-list-${selectListId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
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
      this.wasTouched = true;
      newValue?.map((v) => {
        formData.append(this.name, v);
      });
      const newValueToApply = newValue !== undefined ? formData : null;
      this.selectValues();
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
   * A filter value passed to the list.
   */
  @Prop() filter?: string;
  @Watch('filter')
  handleFilterChange() {
    this.applyFilter();
  }
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
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
   * Determines if the component accepts multiple values.
   * @category Data
   * @visibility persistent
   */
  @Prop() multiple: boolean = true;
  /**
   * Determines if the component is required in a form context.
   * @category Data
   */
  @Prop() required?: boolean;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  @Watch('disabled')
  handleDisabledChanged(newValue: boolean, oldValue: boolean) {
    if (!isEqual(newValue, oldValue)) {
      const items = this.elm.querySelectorAll('br-select-list-item');
      Array.from(items).forEach((it) => (it.disabled = newValue));
    }
  }
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
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
   * Determines if a previously selected value is deselected when the user selects it again.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() selectingSameValueDeselects: boolean = true;
  /**
   * Determines whether the focus states and invalid state are visible.
   * @category Appearance
   */
  @Prop({ reflect: true }) hideStates: boolean = false;
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
    this.hoveredElement = null;
    this.selectValues();
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
   * Listens to select events emitted from select list items.
   */
  @Listen('select')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSelect(e: CustomEvent<{ value: any }>) {
    this.selectItem(e.detail.value, e.target);
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
      this.selectValues();
      const formData = new FormData();
      this.value?.map((v) => {
        formData.append(this.name, v);
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
      this.selectValues();
      const formData = new FormData();
      this.value?.map((v) => {
        formData.append(this.name, v);
      });
      this.internals?.setFormValue(formData);
    }
    if (this.disabled !== undefined) {
      const items = this.elm.querySelectorAll('br-select-list-item');
      Array.from(items).forEach((it) => (it.disabled = this.disabled));
    }
  }

  componentDidLoad() {
    if (this.internals?.form) {
      this.internals?.form.addEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
    this.updateValidity();
  }

  disconnectedCallback() {
    this.hoveredElement = null;
    if (this.internals?.form) {
      this.internals?.form.removeEventListener('invalid', this.updateTouchOnFormSubmission, true);
    }
  }

  formResetCallback() {
    this.clearValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formStateRestoreCallback(state: any[] | undefined) {
    this.value = state;
  }

  private updateTouchOnFormSubmission = () => {
    this.wasTouched = true;
  };

  private selectValues = () => {
    const items = this.elm.querySelectorAll('br-select-list-item');
    if (!items) {
      return;
    }
    if (this.value) {
      const includedInValue = Array.from(items).filter((it) => this.value?.includes(it.value));
      const notIncludedInValue = Array.from(items).filter((it) => !this.value?.includes(it.value));
      includedInValue.forEach((it) => {
        it.selected = true;
        it.selectedValue = this.value;
      });
      notIncludedInValue.forEach((it) => {
        it.selected = false;
        it.selectedValue = this.value;
      });
    } else {
      Array.from(items).map((it) => {
        it.selected = false;
        it.selectedValue = this.value;
      });
    }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectItem = (value: any, target: EventTarget | null) => {
    const listItemTarget = target as HTMLBrSelectListItemElement | null;
    if (!listItemTarget) {
      return;
    }
    if (this.multiple) {
      const isSelected = (this.value || []).includes(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredValues = (this.value || []).filter((v: any) => !isEqual(v, value));
      const valueForSelected = filteredValues.length > 0 ? filteredValues : undefined;
      if (this.selectingSameValueDeselects) {
        this.value = isSelected ? valueForSelected : [...(this.value || []), value];
        listItemTarget.selected = !isSelected;
      } else {
        this.value = isSelected ? this.value : [...(this.value || []), value];
        listItemTarget.selected = true;
      }
    } else {
      const isSelected = (this.value || []).includes(value);
      if (this.selectingSameValueDeselects) {
        this.value = isSelected ? undefined : [value];
        listItemTarget.selected = !isSelected;
      } else {
        this.value = isSelected ? this.value : [value];
        listItemTarget.selected = true;
      }
    }
    this.hoveredElement = listItemTarget;
    (this.elm.shadowRoot?.querySelector('.br-select-list-items-wrapper') as HTMLDivElement)?.focus({
      preventScroll: true,
    });
    this.handleNativeChange();
  };

  private getNextListItem = (
    direction: 'forward' | 'backward',
    shouldSelect?: boolean,
  ): HTMLBrSelectListItemElement | null => {
    if (document.activeElement !== this.elm) {
      (
        this.elm.shadowRoot?.querySelector('.br-select-list-items-wrapper') as HTMLDivElement
      )?.focus({
        preventScroll: true,
      });
      return null;
    } else {
      let sibling = this.hoveredElement
        ? this.hoveredElement[
            direction === 'forward' ? 'nextElementSibling' : 'previousElementSibling'
          ]
        : undefined;
      while (sibling) {
        if (
          sibling.tagName.toLowerCase() === 'br-select-list-item' &&
          !(sibling as HTMLBrSelectListItemElement).filteredOut
        ) {
          if (shouldSelect && !this.disabled) {
            if (sibling && !this.initialShiftKeyDirection) {
              this.selectItem((sibling as HTMLBrSelectListItemElement).value, sibling);
            }
            if (this.initialShiftKeyDirection) {
              if (!this.initialShiftKeyElement?.selected) {
                this.selectItem(
                  (this.initialShiftKeyElement as HTMLBrSelectListItemElement).value,
                  this.initialShiftKeyElement,
                );
              }
              const matchesDirection = direction === this.initialShiftKeyDirection;
              if (matchesDirection) {
                if (this.hoveredElement && !this.hoveredElement.selected) {
                  this.selectItem(this.hoveredElement.value, this.hoveredElement);
                }
                if (sibling && !(sibling as HTMLBrSelectListItemElement).selected) {
                  this.selectItem(
                    (sibling as HTMLBrSelectListItemElement).value,
                    this.hoveredElement,
                  );
                }
              } else {
                if (this.hoveredElement && this.hoveredElement.selected) {
                  this.selectItem(this.hoveredElement.value, this.hoveredElement);
                }
              }
            }
          }
          return (this.hoveredElement = sibling as HTMLBrSelectListItemElement);
        }
        sibling =
          sibling[direction === 'forward' ? 'nextElementSibling' : 'previousElementSibling'];
      }
      return null;
    }
  };

  private getListItemForTypedString = () => {
    const items = this.elm.querySelectorAll('br-select-list-item');
    const itemArray = Array.from(items);
    if (this.typeahead) {
      const isSingleCharacter = this.typeaheadString?.length === 1;
      const elementsStartingWithCharacter = isSingleCharacter
        ? itemArray.filter(
            (it) =>
              this.typeaheadString &&
              it.textContent?.toLowerCase().startsWith(this.typeaheadString.toLowerCase()),
          )
        : undefined;
      const indexOfHoveredElement = elementsStartingWithCharacter
        ? elementsStartingWithCharacter.findIndex((it) => isEqual(it, this.hoveredElement))
        : -1;
      const nextItem =
        elementsStartingWithCharacter &&
        (indexOfHoveredElement + 1 > elementsStartingWithCharacter.length - 1
          ? 0
          : indexOfHoveredElement + 1);
      const toBeHovered =
        isSingleCharacter &&
        this.hoveredElement &&
        nextItem !== undefined &&
        elementsStartingWithCharacter
          ? elementsStartingWithCharacter[nextItem]
          : undefined;
      const filteredItems = itemArray.filter(
        (it) =>
          (this.typeaheadString &&
            it.textContent?.toLowerCase().includes(this.typeaheadString.toLowerCase())) ||
          similarityRatio(this.typeaheadString!, it.textContent!) >= 0.65,
      );
      if (toBeHovered || filteredItems[0]) {
        this.hoveredElement = toBeHovered || filteredItems[0];
      }
    }
  };

  private applyFilter = () => {
    const items = this.elm.querySelectorAll('br-select-list-item');
    const itemArray = Array.from(items);
    if (this.filter) {
      const filteredItems = itemArray.filter(
        (it) =>
          (this.filter && it.textContent?.toLowerCase().includes(this.filter.toLowerCase())) ||
          similarityRatio(this.filter!, it.textContent!) >= 0.5,
      );
      itemArray.forEach((f) => {
        if (filteredItems.includes(f)) {
          f.filteredOut = false;
        } else {
          f.filteredOut = true;
        }
      });
    } else {
      itemArray.forEach((f) => {
        f.filteredOut = false;
      });
    }
  };

  private handleNativeClick = () => {
    this.wasTouched = this.invalidAfterTouch === 'click' || this.wasTouched;
  };

  private handleNativeChange = () => {
    this.wasTouched = this.invalidAfterTouch === 'change' || this.wasTouched;
    this.input.emit({ value: this.value });
    this.change.emit({ value: this.value });
  };

  private focusFirstItem = () => {
    const items = this.elm.querySelectorAll('br-select-list-item');
    if (!items) {
      return;
    }
    this.hoveredElement = items[0];
  };

  private focusLastItem = () => {
    const items = this.elm.querySelectorAll('br-select-list-item');
    if (!items) {
      return;
    }
    this.hoveredElement = items[items.length - 1];
  };

  private selectAllItems = () => {
    if (!this.disabled) {
      const items = this.elm.querySelectorAll('br-select-list-item');
      const itemValues = Array.from(items || []).map((it) => it.value);
      const isEverythingSelected = this.value
        ? itemValues.filter((v) => !this.value!.includes(v)).length === 0
        : false;
      if (!isEverythingSelected) {
        this.value = itemValues;
      } else {
        this.value = undefined;
      }
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.multiple && (e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      this.typeahead = undefined;
      return this.selectAllItems();
    }
    if (
      this.multiple &&
      e.shiftKey &&
      !this.initialShiftKeyDirection &&
      (e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
      this.initialShiftKeyDirection = e.key === 'ArrowUp' ? 'backward' : 'forward';
      this.initialShiftKeyElementActiveState = this.hoveredElement?.selected || false;
      this.initialShiftKeyElement = this.hoveredElement;
    }
    if (
      this.multiple &&
      (!e.shiftKey ||
        (e.shiftKey &&
          e.key === 'ArrowUp' &&
          this.hoveredElement === this.initialShiftKeyElement &&
          this.initialShiftKeyElement?.selected &&
          this.initialShiftKeyDirection === 'forward') ||
        (e.shiftKey &&
          e.key === 'ArrowDown' &&
          this.hoveredElement === this.initialShiftKeyElement &&
          this.initialShiftKeyElement?.selected &&
          this.initialShiftKeyDirection === 'backward'))
    ) {
      this.initialShiftKeyDirection = e.key === 'ArrowUp' ? 'backward' : 'forward';
      this.initialShiftKeyElementActiveState = !this.hoveredElement?.selected;
      this.initialShiftKeyElement = this.hoveredElement;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      this.typeaheadString = undefined;
      return this.focusFirstItem();
    }
    if (e.key === 'End') {
      e.preventDefault();
      this.typeaheadString = undefined;
      return this.focusLastItem();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.typeaheadString = undefined;
      return this.getNextListItem('forward', this.multiple && e.shiftKey);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.typeaheadString = undefined;
      return this.getNextListItem('backward', this.multiple && e.shiftKey);
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      this.typeaheadString = undefined;
      return this.hoveredElement?.click();
    }
    if (this.typeaheadTimeout) {
      clearTimeout(this.typeaheadTimeout);
    }
    if (this.typeahead && e.key.length === 1) {
      this.typeaheadString = (this.typeaheadString || '') + e.key;
      this.typeaheadTimeout = setTimeout(() => {
        this.typeaheadString = undefined;
      }, 300);
      this.getListItemForTypedString();
    }
  };

  private handleFocus = () => {
    if (!this.focused) {
      this.focused = true;
      (
        this.elm.shadowRoot?.querySelector('.br-select-list-items-wrapper') as HTMLDivElement
      )?.focus({
        preventScroll: true,
      });
    }
    const items = Array.from(
      this.elm.querySelectorAll('br-select-list-item:not([filtered-out])'),
    ) as HTMLBrSelectListItemElement[];
    const hoveredValueElements =
      this.value && items
        ? items.map((it, i) => {
            if (this.value?.includes(it.value)) {
              return {
                item: it,
                index: i,
              };
            }
          })
        : undefined;
    if (!this.hoveredElement) {
      const hoveredValueElementsSorted = (hoveredValueElements || [])
        .filter((it) => it !== undefined)
        .sort((a, b) => {
          return a.index < b.index ? 1 : -1;
        });
      return (this.hoveredElement =
        hoveredValueElementsSorted[0]?.item ||
        this.elm.querySelector('br-select-list-item:not([filtered-out])'));
    }
  };

  private handleBlur = () => {
    this.focused = false;
    this.hoveredElement = null;
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

    const renderEmptyState = () => {
      const items = this.elm.querySelectorAll('br-select-list-item');
      const filteredItems = Array.from(items).filter((it) => it.filteredOut);
      const showEmptyState = this.filter && filteredItems.length === items.length;
      if (showEmptyState) {
        return (
          <slot name="empty-filtered-state">
            <span>No matching items.</span>
          </slot>
        );
      }
    };

    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        role="listbox"
        aria-multiselectable={this.multiple}
      >
        <div
          class={{
            'br-select-list-items-wrapper': true,
          }}
          tabindex={0}
          onClick={this.handleNativeClick}
          onKeyDown={this.handleKeyDown}
          onKeyUp={(e) => {
            if (!e.shiftKey) {
              this.initialShiftKeyDirection = null;
              this.initialShiftKeyElementActiveState = false;
              this.initialShiftKeyElement = null;
            }
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          <input ref={(ref) => (this.inputRef = ref)} tabindex={-1} />
          <div
            class={{
              'br-select-list-invalid-wrapper': true,
              'br-select-list-invalid':
                isTouched && this.errorDisplayType && !this.internalValidityState.valid,
            }}
          />
          <slot></slot>
          {renderEmptyState()}
        </div>
        <div class="br-select-list-annotation-wrapper">
          <slot name="hint"></slot>
          <slot name="inline-error">{this.errorDisplayType && renderInputError()}</slot>
        </div>
      </Host>
    );
  }
}

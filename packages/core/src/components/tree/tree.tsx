import {
  Component,
  ComponentInterface,
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
import { isEqual } from 'lodash-es';
import { similarityRatio } from '../select-list/utils/utils';
import { isElementVisible } from '../../utils/utils';
import { DebugMode } from '../debug/types/utils';

//TODO Aria roles

/**
 * The Tree component displays child Tree Item components in a nested structure.
 * @category Navigation
 * @slot - Passes the Tree Items to the Tree.
 */
@Component({
  tag: 'br-tree',
  styleUrl: 'css/tree.css',
  formAssociated: true,
  shadow: true,
})
export class Tree implements ComponentInterface {
  /**
   * A timeout that tracks when a typeahead value change happens.
   */
  private typeaheadTimeout: ReturnType<typeof setTimeout>;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTreeElement;
  /**
   * Associates the component to the form.
   */
  private internals: ElementInternals | null;
  /**
   * Whether the list is focused.
   */
  @State() focused: boolean = false;
  /**
   * Stores a typed value to support typeahead.
   */
  @State() typeaheadString?: string;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyDirection: 'backward' | 'forward' | null;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyElement: HTMLBrTreeItemElement | null;
  /**
   * Initial shift key item.
   */
  @State() initialShiftKeyElementActiveState: boolean;
  /**
   * Tracks the hovered element with arrows.
   */
  @State() hoveredElement: HTMLBrTreeItemElement | null;
  @Watch('hoveredElement')
  handleHoveredElementChange(
    newValue: HTMLBrTreeItemElement | null,
    oldValue: HTMLBrTreeItemElement | null,
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
   * Determines the selection allowed by the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() selection: 'single' | 'multiple' | false = 'multiple';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  @Watch('disabled')
  handleDisabledChanged(newValue: boolean, oldValue: boolean) {
    if (!isEqual(newValue, oldValue)) {
      const items = this.elm.querySelectorAll('br-tree-item');
      Array.from(items).forEach((it) => (it.disabled = newValue));
    }
  }
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';
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
   * Defines the value of the component.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() value: any[] | undefined;
  @Watch('value')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleValueChange(newValue: any[] | undefined, oldValue: any[] | undefined) {
    const formData = new FormData();
    if (!isEqual(newValue, oldValue)) {
      newValue?.map((v) => {
        formData.append(this.name, v);
      });
      const newValueToApply = newValue !== undefined ? formData : null;
      this.selectValues();
      this.internals?.setFormValue(newValueToApply);
      this.valueChange.emit({ value: newValue });
    }
    this.selectValues();
  }
  /**
   * Defines the default value of the component.
   * @category Data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop() defaultValue?: any[];
  /**
   * Determines whether the component focuses an item as the user types.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() typeahead?: boolean = true;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Whether the tree shows in a rounded corner container.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) roundedCorners?: boolean = true;
  /**
   * Defines the name associated with this component in the context of a form.
   * @category Data
   */
  @Prop({ reflect: true }) name: string;
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
   * A method to clear the value of the input
   */
  @Method()
  async clearValue(): Promise<void> {
    if (!this.elm) {
      return;
    }
    this.value = undefined;
    this.hoveredElement = null;
    this.selectValues();
    this.internals?.setFormValue(null);
    this.change.emit({ value: undefined });
  }
  /**
   * Listens to select events emitted from select list items.
   */
  @Listen('select')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSelect(e: CustomEvent<{ value: any }>) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.selectItem(e.detail.value, e.target);
  }
  /**
   * Listens to accordion opening events emitted from tree items.
   */
  @Listen('open')
  handleOpen() {
    this.checkOpenStates();
  }
  /**
   * Listens to accordion closing events emitted from tree items.
   */
  @Listen('close')
  handleClose() {
    this.checkOpenStates();
  }
  /**
   * Listens to keydown events.
   */
  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLBrTreeItemElement;
    const targetToUse: HTMLBrTreeItemElement =
      target.tagName.toLowerCase() === 'br-tree-item'
        ? target
        : (target.closest('br-tree-item') as HTMLBrTreeItemElement) || this.hoveredElement;
    if (targetToUse === null) {
      return;
    }

    const treeItems = this.elm.querySelectorAll('br-tree-item');
    const visibleTreeArrays = Array.from(treeItems).filter((t) => t.offsetParent !== null);
    const index = visibleTreeArrays.indexOf(targetToUse as HTMLBrTreeItemElement);

    if (!this.hoveredElement) {
      this.hoveredElement = visibleTreeArrays[index];
    }
    const hasChildren = targetToUse.querySelector(':scope > *[slot="children"]') !== null;
    if (this.selection === 'multiple' && (event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      this.typeahead = undefined;
      return this.selectAllItems();
    }
    if (
      this.selection === 'multiple' &&
      event.shiftKey &&
      !this.initialShiftKeyDirection &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      this.initialShiftKeyDirection = event.key === 'ArrowUp' ? 'backward' : 'forward';
      this.initialShiftKeyElementActiveState = this.hoveredElement?.selected || false;
      this.initialShiftKeyElement = this.hoveredElement;
    }
    if (
      this.selection === 'multiple' &&
      (!event.shiftKey ||
        (event.shiftKey &&
          event.key === 'ArrowUp' &&
          this.hoveredElement === this.initialShiftKeyElement &&
          this.initialShiftKeyElement?.selected &&
          this.initialShiftKeyDirection === 'forward') ||
        (event.shiftKey &&
          event.key === 'ArrowDown' &&
          this.hoveredElement === this.initialShiftKeyElement &&
          this.initialShiftKeyElement?.selected &&
          this.initialShiftKeyDirection === 'backward'))
    ) {
      this.initialShiftKeyDirection = event.key === 'ArrowUp' ? 'backward' : 'forward';
      this.initialShiftKeyElementActiveState = !this.hoveredElement?.selected;
      this.initialShiftKeyElement = this.hoveredElement;
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      this.typeaheadString = undefined;
      return this.selectItem(this.hoveredElement?.value, this.hoveredElement);
    }
    if (event.key === 'ArrowDown') {
      return this.getNextListItem(
        'forward',
        this.selection === 'multiple' && event.shiftKey,
        visibleTreeArrays,
      );
    }
    if (event.key === 'ArrowUp') {
      return this.getNextListItem(
        'backward',
        this.selection === 'multiple' && event.shiftKey,
        visibleTreeArrays,
      );
    }
    if (event.key === 'ArrowLeft') {
      if (visibleTreeArrays[index].isOpen && hasChildren) {
        return (visibleTreeArrays[index].isOpen = false);
      } else {
        const previousChild = visibleTreeArrays[index].parentElement as HTMLBrTreeItemElement;
        if (previousChild && previousChild.tagName.toLowerCase() === 'br-tree-item') {
          return (this.hoveredElement = previousChild);
        }
      }
    }
    if (event.key === 'ArrowRight') {
      if (!visibleTreeArrays[index].isOpen && hasChildren) {
        return (visibleTreeArrays[index].isOpen = true);
      } else {
        const nextChild = visibleTreeArrays[index].querySelector(
          'br-tree-item',
        ) as HTMLBrTreeItemElement;
        if (nextChild) {
          return (this.hoveredElement = nextChild);
        }
      }
    }
    if (event.key === 'Home') {
      return (this.hoveredElement = visibleTreeArrays[0]);
    }
    if (event.key === 'End') {
      return (this.hoveredElement = visibleTreeArrays[visibleTreeArrays.length - 1]);
    }
    if (event.key === '*') {
      const siblings = target.parentElement?.querySelectorAll('br-tree-item') || [];
      Array.from(siblings).forEach((sibling) => {
        sibling.isOpen = true;
      });
    }
    if (!this.typeahead) {
      return;
    }
    if (this.typeaheadTimeout) {
      clearTimeout(this.typeaheadTimeout);
    }
    if (event.key.length === 1) {
      this.typeaheadString = (this.typeaheadString || '') + event.key;
      this.typeaheadTimeout = setTimeout(() => {
        this.typeaheadString = undefined;
      }, 300);
      this.getTreeItemForTypedString(targetToUse as HTMLBrTreeItemElement, visibleTreeArrays);
    }
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
      const items = this.elm.querySelectorAll('br-tree-item');
      Array.from(items).forEach((it) => (it.disabled = this.disabled));
    }
  }

  componentDidLoad(): Promise<void> | void {
    this.selectValues();
  }

  formResetCallback() {
    this.clearValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formStateRestoreCallback(state: any[] | undefined) {
    this.value = state;
  }

  disconnectedCallback(): void {
    this.hoveredElement = null;
  }

  private getNextListItem = (
    direction: 'forward' | 'backward',
    shouldSelect: boolean,
    visibleTreeArrays: HTMLBrTreeItemElement[],
  ): HTMLBrTreeItemElement | null => {
    if (document.activeElement !== this.elm) {
      this.elm?.focus({
        preventScroll: true,
      });
      return null;
    } else {
      const hoveredIndex = visibleTreeArrays.findIndex((it) => it === this.hoveredElement);
      let sibling = this.hoveredElement
        ? visibleTreeArrays[direction === 'forward' ? hoveredIndex + 1 : hoveredIndex - 1]
        : undefined;
      while (sibling) {
        if (sibling.tagName.toLowerCase() === 'br-tree-item') {
          if (shouldSelect && !this.disabled) {
            if (sibling && !this.initialShiftKeyDirection) {
              this.selectItem((sibling as HTMLBrTreeItemElement).value, sibling);
            }
            if (this.initialShiftKeyDirection) {
              if (!this.initialShiftKeyElement?.selected) {
                this.selectItem(
                  (this.initialShiftKeyElement as HTMLBrTreeItemElement).value,
                  this.initialShiftKeyElement,
                );
              }
              const matchesDirection = direction === this.initialShiftKeyDirection;
              if (matchesDirection) {
                if (this.hoveredElement && !this.hoveredElement.selected) {
                  this.selectItem(this.hoveredElement.value, this.hoveredElement);
                }
                if (sibling && !(sibling as HTMLBrTreeItemElement).selected) {
                  this.selectItem((sibling as HTMLBrTreeItemElement).value, this.hoveredElement);
                }
              } else {
                if (this.hoveredElement && this.hoveredElement.selected) {
                  this.selectItem(this.hoveredElement.value, this.hoveredElement);
                }
              }
            }
          }
          return (this.hoveredElement = sibling as HTMLBrTreeItemElement);
        }
        sibling = visibleTreeArrays[direction === 'forward' ? hoveredIndex + 2 : hoveredIndex - 2];
      }
      return null;
    }
  };

  private selectAllItems = () => {
    if (!this.disabled) {
      const items = this.elm.querySelectorAll('br-tree-item');
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

  private selectValues = () => {
    const items = this.elm.querySelectorAll('br-tree-item');
    if (!items) {
      return;
    }
    if (this.value) {
      const includedInValue = Array.from(items).filter((it) => this.value?.includes(it.value));
      const notIncludedInValue = Array.from(items).filter((it) => !this.value?.includes(it.value));
      includedInValue.forEach((it) => {
        it.selected = true;
        // it.selectedValue = this.value;
      });
      notIncludedInValue.forEach((it) => {
        it.selected = false;
        // it.selectedValue = this.value;
      });
    } else {
      Array.from(items).map((it) => {
        it.selected = false;
        // it.selectedValue = this.value;
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectItem = (value: any, target: EventTarget | null) => {
    const listItemTarget = target as HTMLBrTreeItemElement | null;
    if (!listItemTarget || this.selection === false) {
      return;
    }
    if (this.selection === 'multiple') {
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
    this.elm.focus();
  };

  private getTreeItemForTypedString = (
    target: HTMLBrTreeItemElement,
    visibleItems: HTMLBrTreeItemElement[],
  ) => {
    const itemArray = visibleItems;
    const isSingleCharacter = this.typeaheadString?.length === 1;
    const elementsStartingWithCharacter = isSingleCharacter
      ? itemArray.filter(
          (it) =>
            this.typeaheadString &&
            it
              .querySelector('*:not([slot])')
              ?.textContent?.toLowerCase()
              .startsWith(this.typeaheadString.toLowerCase()),
        )
      : undefined;
    const indexOfHoveredElement = elementsStartingWithCharacter
      ? elementsStartingWithCharacter.findIndex((it) => isEqual(it, target))
      : -1;
    const nextItem =
      elementsStartingWithCharacter &&
      (indexOfHoveredElement + 1 > elementsStartingWithCharacter.length - 1
        ? 0
        : indexOfHoveredElement + 1);
    const toBeHovered =
      isSingleCharacter && nextItem !== undefined && elementsStartingWithCharacter
        ? elementsStartingWithCharacter[nextItem]
        : undefined;
    const filteredItems = itemArray.filter(
      (it) =>
        (this.typeaheadString &&
          it
            .querySelector('*:not([slot])')
            ?.textContent?.toLowerCase()
            .includes(this.typeaheadString.toLowerCase())) ||
        similarityRatio(this.typeaheadString!, it.textContent!) >= 0.65,
    );
    if (toBeHovered || filteredItems[0]) {
      this.hoveredElement = toBeHovered || filteredItems[0];
    }
  };

  private checkOpenStates = () => {
    if (!this.roundedCorners) {
      return;
    }
    const treeItems = this.elm.querySelectorAll('br-tree-item');
    treeItems.forEach((t) => {
      const button = t.shadowRoot?.querySelector('br-button');
      button?.classList.remove('br-tree-item-wrapper-last');
      button?.classList.remove('br-tree-item-wrapper-first');
    });
    const visibleTreeArrays = Array.from(treeItems).filter((t) => t.offsetParent !== null);

    const firstItem = visibleTreeArrays[0];
    firstItem.shadowRoot?.querySelector('br-button')?.classList.add('br-tree-item-wrapper-first');
    const lastItem = visibleTreeArrays[visibleTreeArrays.length - 1];
    lastItem.shadowRoot?.querySelector('br-button')?.classList.add('br-tree-item-wrapper-last');
  };

  private handleFocus = () => {
    if (!this.focused) {
      this.focused = true;
      this.elm?.focus({
        preventScroll: true,
      });
    }
    const items = Array.from(this.elm.querySelectorAll('br-tree-item')) as HTMLBrTreeItemElement[];
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
        hoveredValueElementsSorted[0]?.item || this.elm.querySelector('br-tree-item'));
    }
  };

  private handleBlur = () => {
    this.focused = false;
    this.hoveredElement = null;
  };

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        tabindex={0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyUp={(event: KeyboardEvent) => {
          if (!event.shiftKey) {
            this.initialShiftKeyDirection = null;
            this.initialShiftKeyElementActiveState = false;
            this.initialShiftKeyElement = null;
          }
        }}
      >
        {/* <input ref={(ref) => (this.inputRef = ref)} tabindex={-1} /> */}
        <slot></slot>
      </Host>
    );
  }
}

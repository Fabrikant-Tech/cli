import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  Watch,
  h,
} from '@stencil/core';
import { BaseComponentIdType, BaseSize, BaseSizes } from '../../../reserved/editor-types';

/**
 * The Tab List displays the Tab Items that users can select. It is the parent component of the Tab Item.
 * @category Navigation
 * @slot - Passes the Tab Item to the Tab List.
 */
@Component({
  tag: 'br-tab-list',
  styleUrl: 'css/tab-list.css',
  shadow: true,
})
export class TabList implements ComponentInterface {
  @Element() elm: HTMLBrTabListElement;
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop({ mutable: true }) value: string | undefined;
  @Watch('value')
  handleValueChanged(newValue: string | undefined) {
    this.setValue(newValue);
  }
  /**
   * Defines the default value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() defaultValue?: string | undefined;
  /**
   * Determines the direction the content is displayed in the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal';
  @Watch('direction')
  handleDirectionChange(newValue: 'horizontal' | 'vertical') {
    this.setDirection(newValue);
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
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Determines the associated tab content element.
   * @category Data
   */
  @Prop() tabContentId: BaseComponentIdType<HTMLBrTabContentElement, string>;
  /**
   * Emits an event whenever the value changes, similar to how onChange works in React.
   */
  @Event({ cancelable: true }) valueChange!: EventEmitter<{ value: string | undefined }>;

  componentWillLoad() {
    if (this.value) {
      this.setValue(this.value);
    }
    if (this.defaultValue) {
      this.value = this.defaultValue;
      this.setValue(this.defaultValue);
    }
    this.setDirection();
  }

  private setDirection = (value?: 'horizontal' | 'vertical') => {
    const valueToSet = value || this.direction;
    const tabs = this.elm.querySelectorAll('br-tab-item');
    tabs.forEach((tab) => {
      tab.direction = valueToSet;
    });
  };

  private setValue = (value: string | undefined) => {
    const valueToSet = value || this.value;
    const associatedTabContent =
      typeof this.tabContentId === 'string'
        ? document.getElementById(this.tabContentId)
        : this.tabContentId;
    const tabPanel =
      (associatedTabContent as HTMLBrTabContentElement | undefined) ||
      this.elm.querySelector('br-tab-content');
    if (tabPanel) {
      tabPanel.value = valueToSet;
    }
    const tabs = this.elm.querySelectorAll('br-tab-item');
    tabs.forEach((t) => (t.active = false));
    const tabValue = Array.from(tabs).find((tab) => tab.value === valueToSet);
    if (tabValue) {
      tabValue.active = true;
    }
  };

  @Listen('valueChange')
  handleValueChange(event: CustomEvent<{ value: string | undefined }>) {
    if (event.target === this.elm) {
      return;
    }
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.value = event.detail.value;
    this.setValue(event.detail.value);
    this.valueChange.emit({ value: event.detail.value });
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    const currentItem = document.activeElement;
    const tabs = this.elm.querySelectorAll('br-tab-item');
    const currentItemIndex = Array.from(tabs).findIndex((tab) => tab === currentItem);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      const nextItem = tabs[currentItemIndex + 1] as HTMLElement;
      if (nextItem) {
        nextItem.click();
        nextItem.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      const previousItem = tabs[currentItemIndex - 1] as HTMLElement;
      if (previousItem) {
        previousItem.click();
        previousItem.focus();
      }
    }
    if (event.key === 'Home') {
      const firstItem = tabs[0] as HTMLElement;
      if (firstItem) {
        firstItem.click();
        firstItem.focus();
      }
    }
    if (event.key === 'Home') {
      const firstItem = tabs[0] as HTMLElement;
      if (firstItem) {
        firstItem.click();
        firstItem.focus();
      }
    }
    if (event.key === 'End') {
      const lastItem = tabs[tabs.length - 1] as HTMLElement;
      if (lastItem) {
        lastItem.click();
        lastItem.focus();
      }
    }
  }

  render() {
    return (
      <Host
        role="tablist"
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

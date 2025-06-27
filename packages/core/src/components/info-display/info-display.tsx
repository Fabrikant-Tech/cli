import { Component, ComponentInterface, Element, Host, Prop, State, h } from '@stencil/core';
import { ColorType, HorizontalAlignment, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { INFO_DISPLAY_DEFAULT_PROPS } from './types/info-display-types';
import {
  BaseColorType,
  BaseHorizontalAlignment,
  BaseSize,
  BaseSizes,
} from '../../reserved/editor-types';
/**
 * The Info Display component communicates information to users in a large callout box. You can use slots and props to create displays of different styles.
 * @category Display
 * @slot decoration - Passes an icon or other decoration to the Info Display.
 * @slot title - Passes the title to the Info Display.
 * @slot message - Passes the description to the Info Display.
 * @slot actions - A slot to pass actions.
 */
@Component({
  tag: 'br-info-display',
  styleUrl: 'css/info-display.css',
  shadow: { delegatesFocus: true },
})
export class InfoDisplay implements ComponentInterface {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrInfoDisplayElement;
  /**
   * Store whether the actions were added.
   */
  @State() hasActions: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Primary';
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Determines the component's content alignment.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop({ reflect: true })
  contentAlignment: BaseHorizontalAlignment<HorizontalAlignment> = 'Center';
  /**
   * Determines whether the component displays a background.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) noBackground?: boolean;
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

  componentWillLoad(): Promise<void> | void {
    this.hasActions = this.elm.querySelector('*[slot="actions"]') !== null;
  }
  render() {
    const Title = INFO_DISPLAY_DEFAULT_PROPS.headingSize[this.size];
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
      >
        <slot name="decoration"></slot>
        <Title>
          <slot name="title"></slot>
        </Title>
        <slot name="message"></slot>
        <div
          class={{
            'br-info-display-actions': true,
            'br-info-display-actions-empty': !this.hasActions,
          }}
        >
          <slot
            onSlotchange={() => {
              this.hasActions = this.elm.querySelector('*[slot="actions"]') !== null;
            }}
            name="actions"
          ></slot>
        </div>
      </Host>
    );
  }
}

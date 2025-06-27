import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseBoxEdgeSizeModel,
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseElevation,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../reserved/editor-types';
import { ColorName, ColorShadeName } from '../../global/types/roll-ups';
/**
 * The Header component enables the construction of navigation elements that are displayed at the top of the screen.
 * @category Display
 * @slot title - Passes the title to the header.
 * @slot right - Passes the items to the right of header.
 * @slot bottom - Passes items to the bottom of the header.
 */
@Component({
  tag: 'br-header',
  styleUrl: 'css/header.css',
  shadow: true,
})
export class Header {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrHeaderElement;
  /**
   * Store whether the bottom content was added.
   */
  @State() hasBottomContent: boolean = false;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the elevation shadow displayed on the component.
   * @category Appearance
   */
  @Prop() elevation?: BaseElevation = 2;
  /**
   * A box model value for the padding. The value is in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop() padding?: BaseBoxEdgeSizeModel;
  /**
   * Whether the title area should force a min height.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() noTitleMinHeight?: boolean;
  /**
   * Defines the background color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() backgroundColor: BaseColorObjectType<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;

  private internalGetBoundingClientRect() {
    return this.elm?.shadowRoot?.querySelector('br-container')?.getBoundingClientRect();
  }

  componentWillLoad(): void {
    this.hasBottomContent = this.elm.querySelector('*[slot="bottom"]') !== null;
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    const padding = `calc(var(--size-unit) * 4)`;
    return (
      <Host>
        <br-container
          theme={this.theme}
          direction="column"
          fullWidth={true}
          elevation={this.elevation}
          backgroundColor={
            this.backgroundColor
              ? this.backgroundColor
              : {
                  color: 'Background',
                }
          }
          padding={{
            top: this.padding?.top || padding,
            bottom: this.padding?.bottom || padding,
            left: this.padding?.left || padding,
            right: this.padding?.right || padding,
          }}
          minHeight="calc(var(--size-unit) * 17)"
          verticalGap={this.hasBottomContent ? 'calc(var(--size-unit) * 4)' : undefined}
        >
          <br-container
            direction="row"
            fullWidth={true}
            directionAlignment="space-between"
            secondaryAlignment="center"
            minHeight={!this.noTitleMinHeight ? 'calc(var(--size-unit) * 9)' : undefined}
          >
            <br-container
              fullWidth={true}
              shrink={true}
              direction="row"
              directionAlignment="start"
              secondaryAlignment="center"
            >
              <slot name="title"></slot>
            </br-container>
            <br-container
              verticalGap="calc(var(--size-unit) * 2)"
              horizontalGap="calc(var(--size-unit) * 2)"
              direction="row"
              directionAlignment="start"
              secondaryAlignment="center"
              shrink={true}
            >
              <slot name="right"></slot>
            </br-container>
          </br-container>
          <br-container fullWidth={true}>
            <slot
              onSlotchange={() => {
                this.hasBottomContent = this.elm.querySelector('*[slot="bottom"]') !== null;
              }}
              name="bottom"
            ></slot>
          </br-container>
        </br-container>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, Host, Prop, State, h } from '@stencil/core';
import {
  ColorShadeName,
  ColorShadeNameDefault,
  ColorsWithNoShades,
  ColorName,
  getAllUniqueShadeNames,
} from '../../global/types/roll-ups';
import chroma from 'chroma-js';
import { toKebabCase } from '../container/utils/utils';
import { ColorType, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
  BaseHorizontalPosition,
  BasePositionType,
  BaseTwoAxisPosition,
  BaseVerticalPosition,
} from '../../reserved/editor-types';
/**
 * The Badge component displays a visual indicator anchored to a target element. Common uses include rendering notifications, or noting quantity.
 * @category Display
 * @slot - Passes content to the badge.
 * @slot target - The badge is displayed on the target component.
 * @slot left-icon - Passes the left icon.
 * @slot right-icon - Passes the right icon.
 */
@Component({
  tag: 'br-badge',
  styleUrl: 'css/badge.css',
  shadow: true,
})
export class Badge implements ComponentInterface {
  /**
   * A mutation observer to monitor the changes in content.
   */
  private mutationObserver: MutationObserver;
  /**
   * A resize observer to monitor the changes in content.
   */
  private resizeObserver: ResizeObserver;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrBadgeElement;
  /**
   * Stores the position of the badge.
   */
  @State() position: [number, number] | undefined = undefined;
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
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'> = 'Normal';
  /**
   * Defines the color or semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop() color:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`> = 'Neutral';
  /**
   * Determines the placement of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() placement: BasePositionType<
    BaseHorizontalPosition | BaseVerticalPosition | BaseTwoAxisPosition
  > = 'top-right';

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('.br-badge-content')?.getBoundingClientRect();
  }

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    this.resizeObserver = new ResizeObserver(this.setPosition);
    this.mutationObserver = new MutationObserver(this.setPosition);
  }

  componentDidLoad(): Promise<void> | void {
    const target = this.elm.querySelector('[slot="target"]') as globalThis.HTMLElement;
    const isDisplayContent = window.getComputedStyle(target).display === 'contents';
    const displayContentTarget =
      target.shadowRoot?.firstElementChild || target.firstElementChild || target;
    const targetToUse = isDisplayContent ? displayContentTarget : target;
    if (targetToUse) {
      this.resizeObserver.observe(targetToUse);
      this.mutationObserver.observe(targetToUse, { childList: true, attributes: true });
    }
    setTimeout(() => {
      this.setPosition();
    }, 0);
  }

  private setPosition = () => {
    const target = this.elm.querySelector('[slot="target"]') as globalThis.HTMLElement;

    const isDisplayContent = window.getComputedStyle(target).display === 'contents';
    const displayContentTarget =
      target.shadowRoot?.firstElementChild || target.firstElementChild || target;
    const targetToUse = (
      isDisplayContent ? displayContentTarget : target
    ) as globalThis.HTMLElement;

    if (targetToUse) {
      const isLeft = this.placement.includes('left') ? targetToUse.offsetLeft : undefined;
      const isRight = this.placement.includes('right')
        ? targetToUse.offsetLeft + targetToUse.clientWidth
        : undefined;
      const x = isLeft ?? isRight ?? targetToUse.offsetLeft + targetToUse.clientWidth / 2;

      const isTop = this.placement.includes('top') ? targetToUse.offsetTop : undefined;
      const isBottom = this.placement.includes('bottom')
        ? targetToUse.offsetTop + targetToUse.clientHeight
        : undefined;
      const y = isTop ?? isBottom ?? targetToUse.offsetTop + targetToUse.clientHeight / 2;
      this.position = [x, y];
    }
  };

  private getColorBasedOnContrast = (color: string) => {
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(
      color.replace('var(', '').replace(')', ''),
    );
    const contrast = chroma.contrast(backgroundColor, 'white');
    let baseColor: string;
    if (contrast > 3.5) {
      baseColor = 'white';
    } else {
      baseColor = 'black';
    }
    return baseColor;
  };

  render() {
    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.color && !ColorsWithNoShades.includes(this.color);
    const appliedShadeName = shadeNames.find((shade) => this.color?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.color ? this.color.replace(`-${appliedShadeName}`, '') : this.color;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    const backgroundColor = `var(--color-${colorName}${shadeName})`;
    return (
      <Host>
        <div
          style={{
            left: `${(this.position || [])[0]}px`,
            top: `${(this.position || [])[1]}px`,
            color: this.getColorBasedOnContrast(backgroundColor),
          }}
          class="br-badge-content"
        >
          <style>
            {this.color &&
              `
                  :host {
                    --badge-color: ${backgroundColor};
                    --badge-text-color: ${this.getColorBasedOnContrast(backgroundColor)}
                  }`}
          </style>
          <slot name="left-icon"></slot>
          <span>
            <slot></slot>
          </span>
          <slot name="right-icon"></slot>
        </div>
        <slot name="target"></slot>
      </Host>
    );
  }
}

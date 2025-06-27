import { Component, ComponentInterface, Host, Prop, State, h, Element } from '@stencil/core';
import {
  ColorName,
  ColorShadeName,
  ColorsWithNoShades,
  ColorShadeNameDefault,
  getAllUniqueShadeNames,
  isCSSColor,
} from '../../global/types/roll-ups';
import { ColorType, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { toKebabCase } from '../container/utils/utils';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
  BaseTextAlignment,
} from '../../reserved/editor-types';

/**
 * The Text component provides a way to easily add text to interface with full support for type, size, weight, color and style.
 * @category Display
 * @slot - Passes content to the text.
 * @contenteditable
 */
@Component({
  tag: 'br-text',
  styleUrl: 'css/text.css',
  shadow: true,
})
export class Text implements ComponentInterface {
  /**
   * A reference to the text tag.
   */
  private textRef: HTMLElement | undefined;
  /**
   * A reference to the tooltip if one exists.
   */
  private tooltipRef: HTMLBrTooltipElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTextElement;
  /**
   * The text to display in the tooltip.
   */
  @State() tooltipText: string = '';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines type of text element to render.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() tagType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'code' = 'p';
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
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor;
  /**
   * Determines if the component displays an ellipsis when the text does not fit the wrapper.
   * @category Appearance
   */
  @Prop({ reflect: true }) ellipsis?: boolean = true;
  /**
   * Determines whether to show a tooltip on ellipsis.
   * @category Appearance
   */
  @Prop({ reflect: true }) showEllipsisTooltip?: boolean = true;
  /**
   * Determines text alignment.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) align?: BaseTextAlignment = 'left';

  private internalGetBoundingClientRect(): DOMRect {
    if (this.textRef === undefined) {
      return { x: 0, y: 0, height: 0, width: 0, top: 0, bottom: 0, left: 0, right: 0 } as DOMRect;
    }

    return this.textRef.getBoundingClientRect();
  }

  private handleMouseOver = () => {
    const hasEllipsis = this.textRef && this.textRef?.scrollWidth > this.textRef?.clientWidth;
    if (
      !this.textRef ||
      !this.tooltipRef ||
      !this.ellipsis ||
      (this.ellipsis && !this.showEllipsisTooltip) ||
      !hasEllipsis
    ) {
      return;
    }
    this.tooltipText = this.textRef.querySelector('slot')?.assignedNodes()[0]?.textContent || '';

    this.tooltipRef?.openElement(this.textRef);
  };

  componentWillLoad(): Promise<void> | void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    const TextComponent = this.tagType;
    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.color && !ColorsWithNoShades.includes(this.color);
    const appliedShadeName = shadeNames.find((shade) => this.color?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.color ? this.color.replace(`-${appliedShadeName}`, '') : this.color;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    const textColor =
      this.color && isCSSColor(this.color)
        ? this.color
        : `var(--color-${colorName}${shadeName || ''})`;

    return (
      <Host>
        <style>
          {this.color &&
            `:host{
                    --text-assigned-color: ${textColor};
            }`}
        </style>
        <br-tooltip theme={this.theme} ref={(ref) => (this.tooltipRef = ref)}>
          <br-tooltip-content>
            <span style={{ fontSize: 'max(0.75em, 12px)' }}>{this.tooltipText}</span>
          </br-tooltip-content>
        </br-tooltip>
        <TextComponent
          data-contenteditable
          part="text-tag"
          ref={(ref) => (this.textRef = ref)}
          onMouseOver={this.handleMouseOver}
        >
          <slot></slot>
        </TextComponent>
      </Host>
    );
  }
}

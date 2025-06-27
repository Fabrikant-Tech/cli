import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
import { getValueWithOpacity } from '../color-picker/utils/utils';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseOpacityModel,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
  convertGenericZeroToOneToNumber,
} from '../../reserved/editor-types';
/**
 * The Color Preview component displays a preview of a provided color.
 * @category Display
 */
@Component({
  tag: 'br-color-preview',
  styleUrl: 'css/color-preview.css',
  shadow: true,
})
export class ColorPreview implements ComponentInterface {
  /**
   * A reference to the element and host.
   */
  @Element() elm: HTMLBrColorPreviewElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the value of the component.
   * @category Data
   */
  @Prop() value:
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined;
  /**
   * Defines the opacity of the color.
   * @category Data
   * @visibility persistent
   */
  @Prop() opacity: BaseOpacityModel;
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '24px';
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes> = '24px';
  /**
   * The padding in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   */
  @Prop({ reflect: true }) padding?: BaseSize<BaseSizes>;

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
          padding: this.padding,
        }}
      >
        <div
          class={{
            'br-color-preview-checkered-background': this.value !== undefined,
            'br-color-preview-shadow': true,
          }}
        >
          <div class="br-color-preview-inner-shadow"></div>
          <div
            class="br-color-preview-color"
            style={{
              backgroundColor: this.value
                ? getValueWithOpacity(
                    this.value,
                    convertGenericZeroToOneToNumber(this.opacity || 1),
                    this,
                  )
                : 'transparent',
            }}
          >
            {!this.value && <div class="br-color-preview-color-empty"></div>}
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}

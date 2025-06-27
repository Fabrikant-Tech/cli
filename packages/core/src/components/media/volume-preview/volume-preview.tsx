import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
} from '../../../reserved/editor-types';
import { ColorName, ColorShadeName } from '../../../global/types/roll-ups';
import { ColorType } from '../../../generated/types/types';

/**
 * The volume preview component displays a visual representation of the volume level.
 * @category Media
 */
@Component({
  tag: 'br-volume-preview',
  styleUrl: './css/volume-preview.css',
  shadow: true,
})
export class VolumePreview {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrVolumePreviewElement;
  /**
   * The array of bars.
   */
  @State() barArray: number[] = [];
  /**
   * The number of bars.
   */
  @Prop() bars: number = 7;
  /**
   * The volume level.
   */
  @Prop() volume: number = 0;
  @Watch('volume')
  updateBarHeights(newVolume: number) {
    const maxHeight = 100;
    this.barArray = Array.from({ length: this.bars }, (_, i) => {
      const angle = (i / (this.bars - 1)) * ((120 * Math.PI) / 180) + (30 * Math.PI) / 180;
      return Math.abs(Math.sin(angle) * maxHeight * newVolume);
    });
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
    return this.elm.shadowRoot?.querySelector('br-container')?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.updateBarHeights(this.volume);
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  render() {
    return (
      <Host>
        <br-container
          width={this.width}
          height={this.height}
          fullWidth={this.fullWidth}
          fullHeight={this.fullHeight}
          directionAlignment="center"
          secondaryAlignment="center"
          horizontalGap="1px"
          direction="row"
        >
          {this.barArray.map((barHeight) => {
            return (
              <br-container
                borderRadius={{
                  topLeft: 'var(--size-unit)',
                  topRight: 'var(--size-unit)',
                  bottomLeft: 'var(--size-unit)',
                  bottomRight: 'var(--size-unit)',
                }}
                fullWidth={true}
                minHeight="calc(var(--size-unit) / 2)"
                maxHeight="100%"
                shrink={true}
                height={`${barHeight}%`}
                backgroundColor={this.backgroundColor || { color: 'Primary' }}
              />
            );
          })}
        </br-container>
      </Host>
    );
  }
}

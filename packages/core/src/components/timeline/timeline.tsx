import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { FillStyle, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

/**
 * The Timeline component is a wrapper for timeline items.
 * @category Display
 * @slot - Passes the timeline items.
 */
@Component({
  tag: 'br-timeline',
  styleUrl: './css/timeline.css',
  shadow: true,
})
export class Timeline {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTimelineElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
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
   * * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'> = 'Normal';
  @Watch('size')
  handleSizeChanged() {
    this.applySize();
  }
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Solid';
  @Watch('fillStyle')
  handleFillStyleChanged() {
    this.applyFillStyle();
  }
  /**
   * Determines the element in the component that is anchored on the timeline.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) anchor: 'time' | 'title' = 'time';
  @Watch('anchor')
  handleAnchorChanged() {
    this.applyAnchor();
  }

  private applyFillStyle = () => {
    const items = this.elm.querySelectorAll(':scope > br-timeline-item');
    items.forEach((item) => {
      if (!(item as HTMLBrTimelineItemElement).fillStyle) {
        (item as HTMLBrTimelineItemElement).fillStyle = this.fillStyle;
      }
    });
  };

  private applySize = () => {
    const items = this.elm.querySelectorAll(':scope > br-timeline-item');
    items.forEach((item) => {
      if (!(item as HTMLBrTimelineItemElement).size) {
        (item as HTMLBrTimelineItemElement).size = this.size;
      }
    });
  };

  private applyAnchor = () => {
    const items = this.elm.querySelectorAll(':scope > br-timeline-item');
    items.forEach((item) => {
      if (!(item as HTMLBrTimelineItemElement).anchor) {
        (item as HTMLBrTimelineItemElement).anchor = this.anchor;
      }
    });
  };

  componentWillLoad() {
    this.applyFillStyle();
    this.applySize();
    this.applyAnchor();
  }

  render() {
    return (
      <Host
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

import { Component, Host, Prop, State, h } from '@stencil/core';
import { ColorType, FillStyle, Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import {
  BasePositionType,
  BaseHorizontalPosition,
  BaseColorType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorNameShadeType,
} from '../../../reserved/editor-types';
import {
  ColorName,
  ColorShadeName,
  ColorsWithNoShades,
  getAllUniqueShadeNames,
  ColorShadeNameDefault,
} from '../../../global/types/roll-ups';
import { TIMELINE_ITEM_DEFAULT_PROPS } from './types/timeline-item-types';
import { toKebabCase } from '../../container/utils/utils';
import { Element } from '@stencil/core';

/**
 * The Timeline Item component is a child component of the Timeline component. It contains the content for each Timeline Item in the Timeline.
 * @category Display
 * @parent timeline
 * @slot title - Passes the title of the Timeline Item.
 * @slot time - Passes the time of the Timeline Item.
 * @slot icon - Passes an icon to the component.
 * @slot anchor - Passes an anchor to the component.
 * @slot - Passes the content of the Timeline Item.
 */
@Component({
  tag: 'br-timeline-item',
  styleUrl: './css/timeline-item.css',
  shadow: true,
})
export class TimelineItem {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrTimelineItemElement;
  /**
   * Store whether the title was added.
   */
  @State() hasTitle: boolean = false;
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
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'>;
  /**
   * Whether the component anchors on the time or title.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) anchor: 'time' | 'title';
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active?: boolean;
  /**
   * Determines the component's alignment.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) alignment: BasePositionType<BaseHorizontalPosition> = 'left';
  /**
   * Determines the component's connecting line type.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) connectorLineType: 'solid' | 'dashed' | 'dotted' = 'solid';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) fillStyle: FillStyle;
  /**
   * Defines the color of the anchor when the default anchor is used.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) anchorColor?:
    | BaseColorType<ColorType>
    | BaseColorNameType<ColorName>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>;

  componentWillLoad() {
    this.hasTitle = this.elm.querySelector(':scope > *[slot="title"]') !== null;
  }
  render() {
    const Title = TIMELINE_ITEM_DEFAULT_PROPS.headingSize[this.size];

    const hasStyleDefiningProp = this.anchorColor;

    const shadeNames = getAllUniqueShadeNames();
    const mightHaveShadeName = this.anchorColor && !ColorsWithNoShades.includes(this.anchorColor);
    const appliedShadeName = shadeNames.find((shade) => this.anchorColor?.includes(shade));
    const shadeName = mightHaveShadeName
      ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
      : '';

    const appliedColorName =
      appliedShadeName && this.anchorColor
        ? this.anchorColor.replace(`-${appliedShadeName}`, '')
        : this.anchorColor;
    const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

    if (this.anchor === 'title') {
      return (
        <Host>
          {hasStyleDefiningProp && (
            <style>
              {this.anchorColor &&
                `
                  :host {
                    --timeline-item-anchor-connector-dot-color: var(--color-${colorName}${shadeName});
                  }`}
            </style>
          )}
          <div class="br-timeline-item-connector">
            <div class="br-timeline-item-connector-dot-wrapper">
              <slot name="anchor">
                <div class="br-timeline-item-connector-dot">
                  <slot name="icon" />
                </div>
              </slot>
            </div>
            <div class="br-timeline-item-connector-line" />
          </div>
          <div class="br-timeline-item-content">
            <Title
              class={{
                'br-timeline-item-title': true,
                'br-timeline-item-title-hidden': !this.hasTitle,
              }}
            >
              <slot
                onSlotchange={() =>
                  (this.hasTitle = this.elm.querySelector(':scope > *[slot="title"]') !== null)
                }
                name="title"
              ></slot>
            </Title>
            <slot name="time"></slot>
            <slot></slot>
          </div>
        </Host>
      );
    }
    return (
      <Host>
        <div class="br-timeline-item-connector">
          <div class="br-timeline-item-connector-dot-wrapper">
            <slot name="anchor">
              <div class="br-timeline-item-connector-dot">
                <slot name="icon" />
              </div>
            </slot>
          </div>
          <div class="br-timeline-item-connector-line" />
        </div>
        <div class="br-timeline-item-content">
          <slot name="time"></slot>
          <Title class="br-timeline-item-title">
            <slot name="title"></slot>
          </Title>
          <slot></slot>
        </div>
      </Host>
    );
  }
}

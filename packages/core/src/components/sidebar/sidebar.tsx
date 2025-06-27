import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  h,
} from '@stencil/core';
import {
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
  BaseSize,
  BaseSizes,
} from '../../reserved/editor-types';
import { ColorType, Theme } from '../../generated/types/types';
import { ColorName, ColorShadeName } from '../../global/types/roll-ups';
import { ThemeDefault } from '../../generated/types/variables';

/**
 * The Sidebar component enables the construction of navigation elements that are displayed on the side of the screen.
 * @category Display
 * @slot title - Passes the title to the sidebar.
 * @slot - Passes the item to the sidebar.
 * @slot bottom - Passes items to the bottom of the sidebar.
 */
@Component({
  tag: 'br-sidebar',
  styleUrl: 'css/sidebar.css',
  shadow: true,
})
export class Sidebar {
  /**
   * A reference to a tooltip element.
   */
  private tooltipRef: HTMLBrTooltipElement | undefined;
  /**
   * Stores the item that is being hovered.
   */
  @State() hoveredItem: HTMLBrSidebarItemElement | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrSidebarElement;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * Defines the elevation shadow displayed on the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() elevation?: BaseElevation;
  /**
   * Defines if the sidebar is shown in it's open state.
   * @category State
   * @visibility persistent
   */
  @Prop({ mutable: true, reflect: true }) isOpen?: boolean;
  /**
   * Defines the direction of the sidebar.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() closingDirection: 'left' | 'right' = 'left';
  /**
   * Determines if the component displays a toggle affordance.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showToggleAffordance: boolean = true;
  /**
   * Defines the background color applied to the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() backgroundColor?: BaseColorObjectType<
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
  /**
   * Determines where the tooltip is rendered when opened.
   * @category Behavior
   */
  @Prop({ reflect: true }) tooltipPortalDestination?: globalThis.Element | 'inline' | 'root' =
    'root';
  /**
   * Whether a tooltip will be shown in its closed state.
   * @category Behavior
   */
  @Prop() showTooltip?: boolean;
  /**
   * Event emitted when the sidebar is toggled.
   */
  @Event() toggle: EventEmitter<boolean>;

  componentWillLoad() {
    this.elm?.querySelectorAll('br-sidebar-item')?.forEach((item) => {
      item.minimized = !this.isOpen;
    });
  }

  @Listen('hover')
  handleMouseOver(e: CustomEvent<HTMLBrSidebarItemElement | undefined>) {
    if (!this.showTooltip) {
      return;
    }
    const target = e.detail;
    if (target) {
      this.hoveredItem = target;
      this.tooltipRef?.openElement(target);
    } else {
      this.tooltipRef?.closeElement();
    }
  }

  render() {
    const padding = `calc(var(--size-unit) * 4)`;
    const titleDirection = this.closingDirection === 'left' ? 'row' : 'row-reverse';
    const minimizeAffordanceStyling =
      this.closingDirection === 'left'
        ? {
            transform: !this.isOpen ? 'translate(50%, -50%)' : undefined,
            top: !this.isOpen ? '50%' : undefined,
            right: !this.isOpen ? `calc(${padding} * -1)` : undefined,
          }
        : {
            transform: !this.isOpen ? 'translate(-50%, -50%)' : undefined,
            top: !this.isOpen ? '50%' : undefined,
            left: !this.isOpen ? `calc(${padding} * -1)` : undefined,
          };
    const openWidth = this.width || 'calc(var(--size-unit) * 80)';
    return (
      <Host>
        {this.showTooltip && (
          <br-tooltip
            theme={this.theme}
            disabled={this.isOpen}
            interaction="click"
            portalDestination={this.tooltipPortalDestination}
            showArrow={false}
            ref={(ref) => (this.tooltipRef = ref)}
            placement="right"
            strategy="fixed"
          >
            <br-tooltip-content>
              <span style={{ fontSize: 'var(--actionable-element-font-size-normal)' }}>
                {this.hoveredItem
                  ? this.hoveredItem.tooltipLabel || this.hoveredItem.textContent
                  : ''}
              </span>
            </br-tooltip-content>
          </br-tooltip>
        )}
        <br-container
          width={(this.isOpen && openWidth) || 'calc(var(--size-unit) * 17)'}
          backgroundColor={
            this.backgroundColor || {
              color: 'Background',
            }
          }
          elevation={this.elevation}
          direction="column"
          directionAlignment="space-between"
          secondaryAlignment="start"
          height="100%"
          padding={{ left: padding, right: padding, top: padding, bottom: padding }}
        >
          <br-container
            fullWidth={true}
            direction="column"
            directionAlignment="space-between"
            secondaryAlignment="start"
            verticalGap={`${padding}`}
            horizontalGap="0px"
          >
            <br-container
              width="100%"
              secondaryAlignment="center"
              directionAlignment="space-between"
              direction={this.isOpen ? titleDirection : 'column'}
              verticalGap="calc(var(--size-unit) * 4)"
              horizontalGap="calc(var(--size-unit) * 4)"
            >
              <slot name="title"></slot>
              {this.showToggleAffordance && (
                <br-container
                  backgroundColor={
                    !this.isOpen
                      ? {
                          color: 'Background',
                        }
                      : undefined
                  }
                  style={{
                    position: !this.isOpen ? 'absolute' : 'relative',
                    ...minimizeAffordanceStyling,
                  }}
                  zIndex={2}
                  borderRadius={{
                    topLeft:
                      'calc(var(--actionable-element-border-radius-x-small) + calc(var(--size-unit) / 2))',
                    topRight:
                      'calc(var(--actionable-element-border-radius-x-small) + calc(var(--size-unit) / 2))',
                    bottomLeft:
                      'calc(var(--actionable-element-border-radius-x-small) + calc(var(--size-unit) / 2))',
                    bottomRight:
                      'calc(var(--actionable-element-border-radius-x-small) + calc(var(--size-unit) / 2))',
                  }}
                  padding={{
                    left: this.isOpen ? undefined : 'calc(var(--size-unit) / 2)',
                    right: this.isOpen ? undefined : 'calc(var(--size-unit) / 2)',
                    top: this.isOpen ? undefined : 'calc(var(--size-unit) / 2)',
                    bottom: this.isOpen ? undefined : 'calc(var(--size-unit) / 2)',
                  }}
                  elevation={!this.isOpen ? 2 : undefined}
                >
                  <br-button
                    key={this.isOpen ? 'open' : 'close'}
                    class="br-sidebar-toggle"
                    theme={this.theme}
                    fillStyle="Ghost"
                    colorType="Neutral"
                    onClick={() => {
                      this.isOpen = !this.isOpen;
                      this.elm.querySelectorAll('br-sidebar-item').forEach((item) => {
                        item.minimized = !this.isOpen;
                      });
                      this.toggle.emit(this.isOpen);
                    }}
                    size={this.isOpen ? 'Normal' : 'Xsmall'}
                  >
                    <br-icon
                      rotate={this.isOpen ? 0 : 180}
                      iconName={this.closingDirection === 'left' ? 'ChevronLeft' : 'ChevronRight'}
                      slot={this.isOpen ? 'left-icon' : undefined}
                    ></br-icon>
                  </br-button>
                </br-container>
              )}
            </br-container>
            <br-container
              width="100%"
              direction="column"
              directionAlignment="start"
              secondaryAlignment="start"
            >
              <slot></slot>
            </br-container>
          </br-container>
          <slot name="bottom"></slot>
        </br-container>
      </Host>
    );
  }
}

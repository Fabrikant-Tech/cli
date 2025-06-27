import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

/**
 * The Overflow Ellipsis component displays an affordance for selecting elements that have been truncated.
 * @parent overflow-wrapper
 * @slot - Passes custom content to display as an affordance.
 */
@Component({
  tag: 'br-overflow-ellipsis',
  styleUrl: 'css/overflow-ellipsis.css',
  shadow: { delegatesFocus: true },
})
export class OverflowEllipsis implements ComponentInterface {
  /**
   * Determines if the component is displayed in its active state.
   * @category State
   */
  @Prop({ reflect: true }) active: boolean;
  render() {
    return (
      <Host>
        <slot>
          <br-button
            shape="Rectangular"
            size="Normal"
            fillStyle="Ghost"
            colorType="Neutral"
            active={this.active}
          >
            <br-icon iconName="DotsHorizontal" slot="left-icon" />
          </br-button>
        </slot>
      </Host>
    );
  }
}

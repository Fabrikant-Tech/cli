import { Component, h, Host } from '@stencil/core';

/**
 * The Single Select Indicator is a utility component that displays a visual indicator denoting that
 * a single option can be selected from a list of options.
 * @category Inputs & Forms
 * @parent single-select
 */
@Component({
  tag: 'br-single-select-indicator',
  shadow: true,
})
export class SingleSelectIndicator {
  render() {
    return (
      <Host slot="right-icon">
        <br-icon iconName="CaretDownFilled" />
      </Host>
    );
  }
}

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ComboSelectDefault = () => (
  <br-combo-select>
    <br-popover showArrow={false} isOpen={false}>
      <br-input width="100%" slot="target" placeholder="Select something..."></br-input>
      <br-popover-content>
        <br-select-list width="100%">
          <br-select-list-item width="100%" value="1">
            <span>Label 1</span>
          </br-select-list-item>
          <br-select-list-item width="100%" value="2">
            <span>Label 2</span>
          </br-select-list-item>
          <br-select-list-item width="100%" value="3">
            <span>Label 3</span>
          </br-select-list-item>
        </br-select-list>
      </br-popover-content>
    </br-popover>
  </br-combo-select>
);

export const ComboSelectDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ComboSelectDefault,
};

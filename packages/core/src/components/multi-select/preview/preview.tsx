import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const MultiSelectDefault = () => (
  <br-multi-select>
    <br-popover showArrow={true} isOpen={false}>
      <br-tag-input placeholder="Select something..." width="100%" slot="target"></br-tag-input>
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
  </br-multi-select>
);

export const MultiSelectDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: MultiSelectDefault,
};

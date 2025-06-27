import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SingleSelectDefault = () => (
  <br-single-select>
    <br-popover showArrow={false} isOpen={false}>
      <br-button width="100%" slot="target" alignContentToMargins={true}>
        <br-single-select-value placeholder="Select something..."></br-single-select-value>
        <br-single-select-indicator></br-single-select-indicator>
      </br-button>
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
  </br-single-select>
);

export const SingleSelectDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SingleSelectDefault,
};

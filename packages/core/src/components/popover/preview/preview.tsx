import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const PopoverDefault = () => (
  <br-popover isOpen={true}>
    <br-button slot="target">
      <span>Target</span>
    </br-button>
    <br-popover-content>
      <span>Content</span>
    </br-popover-content>
  </br-popover>
);

export const PopoverDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: PopoverDefault,
};

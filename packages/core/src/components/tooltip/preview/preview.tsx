import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const TooltipDefault = () => (
  <br-tooltip isOpen={true}>
    <br-button slot="target">
      <span>Target</span>
    </br-button>
    <br-tooltip-content>
      <span>Content</span>
    </br-tooltip-content>
  </br-tooltip>
);

export const TooltipDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TooltipDefault,
};

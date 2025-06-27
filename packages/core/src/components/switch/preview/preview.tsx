import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SwitchDefault = () => (
  <br-switch>
    <span>Label</span>
  </br-switch>
);

export const SwitchDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SwitchDefault,
};

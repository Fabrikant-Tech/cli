import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const CheckboxDefault = () => (
  <br-checkbox>
    <span>Label</span>
  </br-checkbox>
);

export const CheckboxDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: CheckboxDefault,
};

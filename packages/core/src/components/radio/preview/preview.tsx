import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const RadioDefault = () => (
  <br-radio>
    <span>Label</span>
  </br-radio>
);

export const RadioDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: RadioDefault,
};

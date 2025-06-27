import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ContainerDefault = () => (
  <br-container>
    <span>Content</span>
  </br-container>
);

export const ContainerDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ContainerDefault,
};

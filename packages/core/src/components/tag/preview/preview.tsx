import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const TagDefault = () => (
  <br-tag colorType="Constructive">
    <span>Label</span>
  </br-tag>
);

export const TagDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TagDefault,
};

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ButtonDefault = () => (
  <br-button colorType="Neutral">
    <span>Label</span>
  </br-button>
);

export const ButtonDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ButtonDefault,
};

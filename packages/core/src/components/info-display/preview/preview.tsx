import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const InfoDisplayDefault = () => {
  return (
    <br-info-display colorType="Primary">
      <br-progress slot="decoration" color="Primary" size="Normal" shape="Circular"></br-progress>
      <span slot="title">Info display title</span>
      <span slot="message">Info display message.</span>
      <br-button slot="actions" colorType="Primary">
        <span>Action</span>
      </br-button>
    </br-info-display>
  );
};

export const InfoDisplayDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: InfoDisplayDefault,
};

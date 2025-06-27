import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const ToastDefault = () => (
  <br-toast fillStyle="Ghost" colorType="Primary" expiration="none">
    <br-icon slot="icon" iconName="Book"></br-icon>
    <span slot="title">Title</span>
    <br-button slot="actions">
      <span>Action</span>
    </br-button>
  </br-toast>
);

export const ToastDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ToastDefault,
};

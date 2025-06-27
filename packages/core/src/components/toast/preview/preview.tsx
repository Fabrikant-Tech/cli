import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ToastDefault = () => (
  <br-toast-provider placement="right" alignment="top">
    <br-toast fillStyle="Ghost" colorType="Primary" expiration="none">
      <br-icon slot="icon" iconName="Book"></br-icon>
      <span slot="title">Title</span>
      <br-button slot="actions">
        <span>Action</span>
      </br-button>
    </br-toast>
  </br-toast-provider>
);

export const ToastProviderDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ToastDefault,
};

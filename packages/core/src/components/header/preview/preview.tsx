import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const HeaderDefault = () => (
  <br-header>
    <h5 slot="title">Title</h5>
    <br-button fillStyle="Ghost" slot="right">
      <span>Action</span>
    </br-button>
  </br-header>
);

export const HeaderDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: HeaderDefault,
};

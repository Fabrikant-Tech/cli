import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const BadgeDefault = () => (
  <br-badge placement="top-right">
    <span>#</span>
    <br-button slot="target" colorType="Neutral" fillStyle="Ghost">
      <span>Target</span>
    </br-button>
  </br-badge>
);

export const BadgeDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: BadgeDefault,
};

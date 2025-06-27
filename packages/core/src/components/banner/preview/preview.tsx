import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const BannerDefault = () => (
  <br-banner colorType="Neutral" width="100%" isOpen={true}>
    <span slot="title">Banner title</span>
    <span slot="description">Banner description</span>
  </br-banner>
);

export const BannerDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: BannerDefault,
};

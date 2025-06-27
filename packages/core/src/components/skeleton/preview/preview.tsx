import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SkeletonDefault = () => (
  <br-skeleton width="32px" height="32px" borderRadius="50%"></br-skeleton>
);

export const SkeletonDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SkeletonDefault,
};

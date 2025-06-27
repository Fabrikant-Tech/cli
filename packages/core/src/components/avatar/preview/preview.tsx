import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const AvatarDefault = () => <br-avatar content={'John Appleseed'}></br-avatar>;

export const AvatarDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: AvatarDefault,
};

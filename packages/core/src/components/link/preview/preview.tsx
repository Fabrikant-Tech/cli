import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const LinkDefault = () => {
  return (
    <br-link>
      <span>Link label</span>
    </br-link>
  );
};

export const LinkDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: LinkDefault,
};

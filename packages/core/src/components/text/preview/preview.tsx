import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const TextDefault = () => <br-text>Text</br-text>;

export const TextDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TextDefault,
};

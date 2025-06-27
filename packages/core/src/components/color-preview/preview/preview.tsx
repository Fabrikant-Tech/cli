import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ColorPreviewDefault = () => <br-color-preview value="#d76b17"></br-color-preview>;

export const ColorPreviewDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ColorPreviewDefault,
};

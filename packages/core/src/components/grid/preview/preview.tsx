import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const GridDefault = () => (
  <br-grid width="100%">
    <br-grid-item gridColumn="span 3">1</br-grid-item>
    <br-grid-item gridColumn="span 1">2</br-grid-item>
    <br-grid-item gridColumn="span 2">3</br-grid-item>
    <br-grid-item gridColumn="span 2">4</br-grid-item>
  </br-grid>
);

export const GridDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: GridDefault,
};

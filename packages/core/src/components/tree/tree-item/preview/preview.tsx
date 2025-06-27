import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const TreeItemDefault = () => (
  <br-tree-item value={1}>
    <span>Item 1</span>
  </br-tree-item>
);

export const TreeItemDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TreeItemDefault,
};

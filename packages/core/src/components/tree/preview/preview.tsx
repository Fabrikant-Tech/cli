import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const TreeDefault = () => (
  <br-tree>
    <br-tree-item value={1}>
      <span>Item 1</span>
    </br-tree-item>
    <br-tree-item value={2}>
      <span>Item 2</span>
    </br-tree-item>
    <br-tree-item value={3}>
      <span>Item 3</span>
      <br-tree-item value={4} slot="children">
        <span>Item 4</span>
      </br-tree-item>
    </br-tree-item>
  </br-tree>
);

export const TreeDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TreeDefault,
};

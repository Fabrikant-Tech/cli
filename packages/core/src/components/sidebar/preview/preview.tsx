import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SidebarDefault = () => (
  <br-sidebar>
    <br-icon slot="title" iconName="A" size={36} />
    <br-sidebar-item>
      <br-icon slot="left-icon" iconName="A" />
      <span>Item 1</span>
    </br-sidebar-item>
    <br-sidebar-item>
      <br-icon slot="left-icon" iconName="A" />
      <span>Item 2</span>
    </br-sidebar-item>
    <br-sidebar-item slot="bottom">
      <br-icon slot="left-icon" iconName="A" />
      <span>Item bottom</span>
    </br-sidebar-item>
  </br-sidebar>
);

export const SidebarDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SidebarDefault,
};

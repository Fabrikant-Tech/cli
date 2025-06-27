import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const SidebarItemDefault = () => (
  <br-sidebar-item>
    <br-icon slot="left-icon" iconName="A" />
    <span>Item</span>
  </br-sidebar-item>
);

export const SidebarItemDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SidebarItemDefault,
};

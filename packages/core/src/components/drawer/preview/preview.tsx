import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const DrawerDefault = () => (
  <br-drawer isOpen={true}>
    <br-button slot="target">
      <span>Target</span>
    </br-button>
    <br-drawer-content>
      <br-drawer-header>
        <span>Drawer header</span>
      </br-drawer-header>
      <span>Drawer content</span>
      <br-drawer-footer>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>No</span>
        </br-button>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>Yes</span>
        </br-button>
      </br-drawer-footer>
    </br-drawer-content>
  </br-drawer>
);

export const DrawerDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: DrawerDefault,
};

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const MenuDefault = () => {
  return (
    <br-menu>
      <br-menu-item>
        <span>Option 1</span>
      </br-menu-item>
      <br-menu-item>
        <span>Option 2</span>
      </br-menu-item>
      <br-popover>
        <br-menu-item slot="target">
          <span>Option 3</span>
        </br-menu-item>
        <br-popover-content>
          <br-menu-item>
            <span>Option 4</span>
          </br-menu-item>
          <br-menu-item>
            <span>Option 5</span>
          </br-menu-item>
        </br-popover-content>
      </br-popover>
    </br-menu>
  );
};

export const MenuDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: MenuDefault,
};

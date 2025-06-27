import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const LayoutSidebarContentDefault = () => {
  return (
    <br-layout-header-content width="100%" height="100%">
      <br-container
        width="320px"
        height="100%"
        backgroundColor={{
          color: 'Neutral',
        }}
        directionAlignment="center"
        secondaryAlignment="center"
        slot="sidebar"
      >
        <span>Sidebar</span>
      </br-container>
      <br-container
        width="100%"
        height="100%"
        backgroundColor={{
          color: 'Neutral',
        }}
        directionAlignment="center"
        secondaryAlignment="center"
        slot="content"
      >
        <span>Content</span>
      </br-container>
    </br-layout-header-content>
  );
};

export const LayoutSidebarContentDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: LayoutSidebarContentDefault,
};

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const LayoutHeaderContentDefault = () => {
  return (
    <br-layout-header-content width="100%" height="100%">
      <br-container
        width="100%"
        height="48px"
        backgroundColor={{
          color: 'Neutral',
        }}
        directionAlignment="center"
        secondaryAlignment="center"
        slot="header"
      >
        <span>Header</span>
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

export const LayoutHeaderContentDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: LayoutHeaderContentDefault,
};

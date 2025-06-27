import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ControlGroupDefault = () => (
  <br-control-group>
    <br-button>
      <span>Label</span>
    </br-button>
    <br-button>
      <span>Label</span>
    </br-button>
    <br-button>
      <span>Label</span>
    </br-button>
  </br-control-group>
);

export const ControlGroupDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ControlGroupDefault,
};

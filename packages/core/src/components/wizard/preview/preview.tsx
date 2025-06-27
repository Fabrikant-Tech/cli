import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const WizardDefault = () => (
  <br-wizard width="100%">
    <br-wizard-item active={true} finished={true}>
      <span>Finished step</span>
    </br-wizard-item>
    <br-wizard-item active={true}>
      <br-icon slot="icon" iconName="Book" />
      <span>Active step</span>
    </br-wizard-item>
    <br-wizard-item>
      <br-icon slot="icon" iconName="Book" />
      <span>Inactive step</span>
    </br-wizard-item>
  </br-wizard>
);

export const WizardDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: WizardDefault,
};

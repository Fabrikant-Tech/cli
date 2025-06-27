import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';

const WizardItemDefault = () => (
  <br-wizard-item>
    <span>Step</span>
  </br-wizard-item>
);

export const WizardItemDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: WizardItemDefault,
};

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const ConfirmationDefault = () => (
  <br-confirmation isOpen={true}>
    <br-button slot="target">
      <span>Target</span>
    </br-button>
    <br-confirmation-content>
      <br-confirmation-header>
        <span>Confirmation header</span>
      </br-confirmation-header>
      <span>Confirmation content</span>
      <br-confirmation-footer>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>No</span>
        </br-button>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>Yes</span>
        </br-button>
      </br-confirmation-footer>
    </br-confirmation-content>
  </br-confirmation>
);

export const ConfirmationDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: ConfirmationDefault,
};

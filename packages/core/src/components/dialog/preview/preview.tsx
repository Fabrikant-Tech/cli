import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const DialogDefault = () => (
  <br-dialog isOpen={true}>
    <br-button slot="target">
      <span>Target</span>
    </br-button>
    <br-dialog-content>
      <br-dialog-header>
        <span>Dialog header</span>
      </br-dialog-header>
      <span>Dialog content</span>
      <br-dialog-footer>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>No</span>
        </br-button>
        <br-button fillStyle="Ghost" colorType="Neutral">
          <span>Yes</span>
        </br-button>
      </br-dialog-footer>
    </br-dialog-content>
  </br-dialog>
);

export const DialogDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: DialogDefault,
};

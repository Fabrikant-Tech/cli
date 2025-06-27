import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SelectListDefault = () => (
  <br-select-list width="100%">
    <br-select-list-item width="100%" value="1">
      <span>Label 1</span>
    </br-select-list-item>
    <br-select-list-item width="100%" value="2">
      <span>Label 2</span>
    </br-select-list-item>
    <br-select-list-item width="100%" value="3">
      <span>Label 3</span>
    </br-select-list-item>
  </br-select-list>
);

export const SelectListDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SelectListDefault,
};

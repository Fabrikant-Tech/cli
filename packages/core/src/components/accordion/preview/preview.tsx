import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';
import { SizeUnit } from '../../../generated/types/variables';

const AccordionDefault = () => (
  <br-accordion isOpen={true}>
    <br-container padding={{ left: SizeUnit, top: SizeUnit, right: SizeUnit, bottom: SizeUnit }}>
      <span>Accordion content</span>
    </br-container>
  </br-accordion>
);

export const AccordionDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: AccordionDefault,
};

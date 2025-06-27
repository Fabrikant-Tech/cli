import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const PaginationDefault = () => (
  <br-pagination showResultsPerPageOptions={false} pages={10} activePage={2}></br-pagination>
);

export const PaginationDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: PaginationDefault,
};

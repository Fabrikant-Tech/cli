import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SparklineDefault = () => (
  <br-sparkline width="100px" height="50px">
    <br-sparkline-data data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
  </br-sparkline>
);

export const SparklineDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SparklineDefault,
};

import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const SimpleChartDefault = () => (
  <br-simple-chart width="100%" height="320px">
    <br-simple-chart-bar-series data={[25, 35, 5, 65, 125, 5, 2]} name="Series name" />
    <br-simple-chart-x-axis
      type="category"
      data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
    />
    <br-simple-chart-y-axis type="value" min={0} max={150} />
    <br-simple-chart-legend position="top" orientation="horizontal" />
  </br-simple-chart>
);

export const SimpleChartDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: SimpleChartDefault,
};

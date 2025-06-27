import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../../utils/preview/preview-types';
import { getRelativeTimeFromDate } from '../../utils/utils';

const TimelineItemDefault = () => {
  return (
    <br-timeline-item>
      <br-icon slot="icon" iconName="LargeDot"></br-icon>
      <span slot="time">{getRelativeTimeFromDate(new Date(), new Date('2024-03-21'))}</span>
      <span slot="title">Title</span>
      <span>Description</span>
    </br-timeline-item>
  );
};

export const TimelineItemDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TimelineItemDefault,
};

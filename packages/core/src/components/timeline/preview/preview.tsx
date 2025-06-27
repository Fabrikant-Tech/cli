import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';
import { getRelativeTimeFromDate } from '../utils/utils';

const TimelineDefault = () => {
  return (
    <br-timeline anchor="time" fillStyle="Ghost" size="Normal">
      <br-timeline-item>
        <br-icon slot="icon" iconName="LargeDot"></br-icon>
        <span slot="time">{getRelativeTimeFromDate(new Date(), new Date('2024-03-21'))}</span>
        <span slot="title">Title</span>
        <span>Description</span>
      </br-timeline-item>
      <br-timeline-item active={true}>
        <br-icon slot="icon" iconName="LargeDot"></br-icon>
        <span slot="time">{getRelativeTimeFromDate(new Date(), new Date('2023-03-20'))}</span>
        <span slot="title">Title</span>
        <span>Description</span>
      </br-timeline-item>
      <br-timeline-item>
        <br-icon slot="icon" iconName="LargeDot"></br-icon>
        <span slot="time">{getRelativeTimeFromDate(new Date(), new Date('2022-03-21'))}</span>
        <span slot="title">Title</span>
        <span>Description</span>
      </br-timeline-item>
    </br-timeline>
  );
};

export const TimelineDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: TimelineDefault,
};

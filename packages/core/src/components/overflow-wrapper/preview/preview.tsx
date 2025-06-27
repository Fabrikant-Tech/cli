import { h } from '@stencil/core';
import { DesignbaseComponentExample } from '../../../utils/preview/preview-types';

const OverflowWrapperDefault = () => (
  <br-overflow-wrapper>
    <br-button slot="left-decorator" fillStyle="Ghost" colorType="Neutral">
      <br-icon slot="left-icon" iconName="ChevronLeft"></br-icon>
    </br-button>
    <br-overflow-ellipsis slot="ellipsis-button"></br-overflow-ellipsis>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((it) => {
      return (
        <br-button fillStyle="Ghost" colorType="Neutral" key={'item-' + it}>
          <span>Item {it}</span>
        </br-button>
      );
    })}
    <br-button slot="right-decorator" fillStyle="Ghost" colorType="Neutral">
      <br-icon slot="left-icon" iconName="ChevronRight"></br-icon>
    </br-button>
  </br-overflow-wrapper>
);

export const OverflowWrapperDefaultPreview: DesignbaseComponentExample = {
  name: 'Default',
  render: OverflowWrapperDefault,
};

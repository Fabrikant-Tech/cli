import { h } from '@stencil/core';
import {
  DBExampleStringGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../utils/preview/preview-types';

interface SliderDefaultPropsType {
  rangeName: DBExampleStringGenerator;
}

const SliderDefaultProps: SliderDefaultPropsType = {
  rangeName: DefaultDBExampleGenerators.string,
};

const SliderDefault = (params: SliderDefaultPropsType) => (
  <br-slider value={{ [params.rangeName.value()]: [15, 75] }} step={5}>
    <br-slider-thumb
      rangeName={params.rangeName.value()}
      position="min"
      min={0}
      max={100}
    ></br-slider-thumb>
    <br-slider-thumb
      rangeName={params.rangeName.value()}
      position="max"
      min={0}
      max={100}
    ></br-slider-thumb>
    <br-slider-track
      color="Warning"
      associatedRangeName={params.rangeName.value()}
    ></br-slider-track>
    <br-slider-legend labelStep={5} slot="legend"></br-slider-legend>
  </br-slider>
);

export const SliderDefaultPreview: DesignbaseComponentExample<SliderDefaultPropsType> = {
  name: 'Default',
  params: SliderDefaultProps,
  render: SliderDefault,
};

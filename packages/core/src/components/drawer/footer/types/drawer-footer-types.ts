import { ColorType, FillStyle, Shape, Size } from '../../../../generated/types/types';
import { BaseColorType } from '../../../../reserved/editor-types';

export const DRAWER_FOOTER_DEFAULT_PROPS: {
  primaryActionButtonProps: {
    size: Size;
    shape: Exclude<Shape, 'Circular'>;
    colorType: BaseColorType<ColorType>;
    fillStyle: FillStyle;
  };
  secondaryActionButtonProps: {
    size: Size;
    shape: Exclude<Shape, 'Circular'>;
    colorType: BaseColorType<ColorType>;
    fillStyle: FillStyle;
  };
} = {
  secondaryActionButtonProps: {
    size: 'Normal',
    shape: 'Rectangular',
    colorType: 'Neutral',
    fillStyle: 'Ghost',
  },
  primaryActionButtonProps: {
    size: 'Normal',
    shape: 'Rectangular',
    colorType: 'Primary',
    fillStyle: 'Solid',
  },
};

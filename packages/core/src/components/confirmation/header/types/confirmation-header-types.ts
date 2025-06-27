import { IconName } from '../../../icon/generated/types/asset-types';
import { ColorType, FillStyle, Shape, Size } from '../../../../generated/types/types';
import { BaseColorType } from '../../../../reserved/editor-types';

export const CONFIRMATION_HEADER_DEFAULT_PROPS: {
  closeButtonSize: Size;
  closeButtonShape: Exclude<Shape, 'Circular'>;
  closeButtonColorType: BaseColorType<ColorType>;
  closeButtonFillStyle: FillStyle;
  closeButtonIcon: IconName;
} = {
  closeButtonSize: 'Normal',
  closeButtonShape: 'Rectangular',
  closeButtonColorType: 'Neutral',
  closeButtonFillStyle: 'Ghost',
  closeButtonIcon: 'Cross',
};

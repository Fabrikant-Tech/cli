import { IconName } from '../../icon/generated/types/asset-types';
import { ColorType, FillStyle, Size, Theme } from '../../../generated/types/types';
import { BaseColorType } from '../../../reserved/editor-types';

export interface ToastOptions {
  title: string;
  description?: string;
  actions?: {
    label: string;
    onClick: () => void;
    iconName?: IconName;
    fillStyle?: FillStyle;
    colorType?: BaseColorType<ColorType>;
    size?: Size;
  }[];
  iconName?: IconName;
  fillStyle: FillStyle;
  colorType: BaseColorType<ColorType>;
  expiration?: number | 'none';
  id?: string;
  theme?: Theme;
}

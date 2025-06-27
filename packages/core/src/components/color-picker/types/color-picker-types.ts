import {
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseOpacityModel,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../../reserved/editor-types';

export interface ColorChangeContent {
  value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | undefined;
  hex: BaseHexColor | undefined;
  rgb: BaseRgbColor | undefined;
  hsl: BaseHSLColor | undefined;
  hexa: BaseHexColor | undefined;
  rgba: BaseRgbaColor | undefined;
  hsla: BaseHSLAColor | undefined;
  opacity: BaseOpacityModel;
}

import { ColorType, Theme } from '../../../generated/types/types';
import { BaseColorNameType, BaseColorType, BaseOpacityModel } from '../../../reserved/editor-types';
import { ColorName } from '../../../global/types/roll-ups';

export const SEPARATOR_DEFAULT_PROPS: {
  size: `calc(${string})`;
  color: Record<Theme, BaseColorType<ColorType> | BaseColorNameType<ColorName>>;
  opacity: Record<Theme, BaseOpacityModel>;
} = {
  size: 'calc(max(calc(var(--size-unit) / 4), 1px) * 1)',
  color: {
    Light: 'Black',
    Dark: 'White',
  },
  opacity: {
    Light: '0.15',
    Dark: '0.15',
  },
};

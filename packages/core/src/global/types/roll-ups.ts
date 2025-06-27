import { uniq } from 'lodash-es';
import {
  ThemeLight,
  ThemeDark,
  ColorTypeNeutral,
  Colors,
  TransitionShortDuration,
  TransitionLongDuration,
  ColorTypes,
  ThemeDefault,
} from '../../generated/types/variables';
import { Theme, ColorType } from '../../generated/types/types';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../reserved/editor-types';

export const Themes = [ThemeLight, ThemeDark] as const;
export const ColorTypeDefault: ColorType = ColorTypeNeutral;

type ColorNames<T extends Theme> = keyof (typeof Colors)[T];
export type ColorName = Exclude<
  {
    [T in Theme]: ColorNames<T>;
  }[Theme],
  ColorType
>;
const NeutralIndex = Object.entries(Colors[ThemeDefault]).findIndex((n) => n[0] === 'Neutral');
const NeutralColorName = Object.entries(Colors[ThemeDefault])[NeutralIndex - 1][0] as ColorName;
export const ColorNameDefault: ColorName = NeutralColorName;

export type ShadeNames<
  T extends Theme,
  C extends ColorNames<T>,
> = C extends keyof (typeof Colors)[T]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (typeof Colors)[T][C] extends Record<string, any>
    ? keyof (typeof Colors)[T][C]
    : never
  : never;
export type ColorShadeName = {
  [T in Theme]: {
    [C in ColorNames<T>]: ShadeNames<T, C>;
  }[ColorNames<T>];
}[Theme];
export const ColorShadeNameDefault: ColorShadeName = '500';

function getColorNamesWithoutShades(colors: typeof Colors): string[] {
  const result = new Set<string>();

  for (const themeKey of Object.keys(colors)) {
    const theme = colors[themeKey as keyof typeof Colors];
    for (const [colorKey, colorValue] of Object.entries(theme)) {
      if (typeof colorValue === 'string') {
        result.add(colorKey);
      }
    }
  }

  return Array.from(result);
}

export const ColorsWithNoShades = getColorNamesWithoutShades(Colors);

export function getAllUniqueColorsValues(
  excludedNames?: string[],
  excludedShades?: string[] | 'all',
) {
  let result: string[] = [];
  const LightColors = Colors.Light;
  const DarkColors = Colors.Dark;
  const allColors = { ...LightColors, ...DarkColors };
  Object.entries(allColors).forEach(([colorName, colorValue]) => {
    const isExcluded = excludedNames && excludedNames.includes(colorName);
    if (typeof colorValue === 'string' && !isExcluded) {
      return (result = [...result, colorValue]);
    } else {
      Object.entries(colorValue).forEach(([shadeName, shadeValue]) => {
        const isShadeExcluded =
          (excludedShades === 'all' && shadeName !== ColorShadeNameDefault) ||
          (excludedShades !== 'all' && excludedShades && excludedShades.includes(shadeName));
        if (!isShadeExcluded) {
          return (result = [...result, shadeValue]);
        }
      });
    }
  });
  return uniq(result);
}

export function getAllUniqueColorNames() {
  let result: string[] = [];
  const LightColors = Colors.Light;
  const DarkColors = Colors.Dark;
  const allColors = { ...LightColors, ...DarkColors };
  Object.keys(allColors).forEach((colorName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!result.includes(colorName) && !ColorTypes.includes(colorName as any)) {
      result = [...result, colorName];
    }
  });
  return result;
}

export function getAllUniqueShadeNames() {
  let result: string[] = [];
  const LightColors = Colors.Light;
  const DarkColors = Colors.Dark;
  const allColors = { ...LightColors, ...DarkColors };
  Object.entries(allColors).forEach((c) => {
    const colorValue = c[1];
    if (typeof colorValue !== 'string') {
      Object.keys(colorValue).forEach((shadeName) => {
        if (!result.includes(shadeName)) {
          result = [...result, shadeName];
        }
      });
    }
  });
  return result;
}

export function isCSSColor(
  value:
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameType<ColorName>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | undefined,
) {
  if (value && (value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('#'))) {
    return true;
  }
  return false;
}

export const ShortAnimationDuration = Number(TransitionShortDuration.replace('s', '')) * 100;
export const LongAnimationDuration = Number(TransitionLongDuration.replace('s', '')) * 100;

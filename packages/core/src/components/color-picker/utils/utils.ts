import chroma from 'chroma-js';
import {
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../../reserved/editor-types';

export const incrementHex = (hex: string, increment: number) => {
  hex = hex.replace('#', '');
  let colorInt = parseInt(hex, 16);
  colorInt += increment;
  colorInt = Math.max(0, Math.min(0xffffff, colorInt));
  const newHex = colorInt.toString(16).padStart(6, '0');
  return `#${newHex}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitChange = (value: any, context: any) => {
  context.valueChange.emit({
    value: context.value,
    hex: value ? (getValueBasedOnColorSpace(value, 'hex', context) as `#${string}`) : undefined,
    rgb: value
      ? (getValueBasedOnColorSpace(value, 'rgb', context) as `rgb(${string}, ${string}, ${string})`)
      : undefined,
    hsl: value
      ? (getValueBasedOnColorSpace(
          value,
          'hsl',
          context,
        ) as `hsl(${string}, ${string}%, ${string}%)`)
      : undefined,
    opacity: context.opacity,
    hexa: value ? (getValueBasedOnColorSpace(value, 'hexa', context) as `#${string}`) : undefined,
    rgba: value
      ? (getValueBasedOnColorSpace(
          value,
          'rgba',
          context,
        ) as `rgba(${string}, ${string}, ${string}, ${string})`)
      : undefined,
    hsla: value
      ? (getValueBasedOnColorSpace(
          value,
          'hsla',
          context,
        ) as `hsla(${string}, ${string}%, ${string}%, ${string})`)
      : undefined,
  });
};

export const determineColorSpace = (
  value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor,
) => {
  if (value.includes('hsl')) {
    return 'hsl';
  }
  if (value.includes('rgb')) {
    return 'rgb';
  }
  if (value.includes('#')) {
    return 'hex';
  }
  return undefined;
};

export const getValueBasedOnColorSpace = (
  v: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor,
  colorSpace?: 'hex' | 'rgb' | 'hsl' | 'rgba' | 'hsla' | 'hexa',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any,
) => {
  const opacity = Number(context.opacity);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = v as any;
  const cs = colorSpace || context.activeColorSpace;
  if (cs === 'hex') {
    return chroma(value).hex() as BaseHexColor;
  }
  if (cs === 'hexa') {
    return chroma(value).alpha(opacity).hex() as BaseHexColor;
  }
  if (cs === 'rgb') {
    const rgb = chroma(value).rgb();
    const rgbString = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
    return `rgb(${rgbString})` as BaseRgbColor;
  }
  if (cs === 'hsl') {
    const roundedHSL = getRoundedHSL(chroma(value).hsl(), context);
    const hslString = `${roundedHSL[0]}, ${roundedHSL[1]}%, ${roundedHSL[2]}%`;
    return `hsl(${hslString})` as BaseHSLColor;
  }
  if (cs === 'rgba') {
    const rgb = chroma(value).rgb();
    const rgbString = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
    return `rgba(${rgbString}, ${opacity})` as BaseRgbaColor;
  }
  if (cs === 'hsla') {
    const roundedHSL = getRoundedHSL(chroma(value).hsl(), context);
    const hslString = `${roundedHSL[0]}, ${roundedHSL[1]}%, ${roundedHSL[2]}%`;
    return `hsla(${hslString}, ${opacity})` as BaseHSLAColor;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoundedHSL = (value: [number, number, number], context: any) => {
  const newValue = value.map((v, i) => {
    if (i === 0) {
      const backupHSL = context.shadeColor ? context.shadeColor[0] : 0;
      return parseInt(Math.ceil(!isNaN(v) ? v : backupHSL).toString());
    } else {
      return parseInt((Number(v.toFixed(2)) * 100).toString());
    }
  }) as [number, number, number];
  return newValue;
};

export const getValueWithOpacity = (
  value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor,
  opacity: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
): string => {
  if (opacity !== 1) {
    const colorSpace = determineColorSpace(value);
    return getValueBasedOnColorSpace(
      value,
      (colorSpace + 'a') as 'hexa' | 'rgba' | 'hsla',
      context,
    ) as string;
  } else {
    return value;
  }
};

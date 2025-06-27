/**
 * A type that displays a text area in the view builder.
 */
export type BaseTextArea<T> = T;
/**
 * A type that represents a pixel value.
 */
export type PixelSize = `${number}px`;
/**
 * A type that represents a percentage value.
 */
export type PercentageSize = `${number}%`;
/**
 * A type that represents a CSS variable.
 */
export type CSSVariable = `var(--${string})`;
/**
 * A type that represents a calc string.
 */
export type CalcSize = `calc(${string})`;
/**
 * A type that represents all the possible size types.
 */
export type BaseSizes = PixelSize | PercentageSize | CalcSize | CSSVariable;
/**
 * Utility type to exclude specific size types from a union type and display the
 * appropriate editor in the view builder.
 *
 * @template T - All of the available size types.
 * @template U - The subset of size types to exclude.
 * @returns A new type excluding the specified size types from the total.
 */
export type BaseSize<T, U = undefined> = Exclude<T, U>;
/**
 * Utility type to exclude specific semantic color types from a union type and display the
 * appropriate editor in the view builder.
 *
 * @template T - All of the available semantic color types.
 * @template U - The subset of semantic color types to exclude.
 * @returns A new type excluding the specified semantic color types from the total.
 */
export type BaseColorType<T, U = undefined> = Exclude<T, U>;
/**
 * Utility type to exclude specific semantic color types from a union type and display the
 * appropriate editor in the view builder.
 *
 * @template T - All of the available semantic color types and shades.
 * @template U - The subset of semantic color types to exclude.
 * @returns A new type excluding the specified semantic color types from the total.
 */
export type BaseColorShadeType<T, U = undefined> = Exclude<T, U>;
/**
 * Utility type to exclude specific color names from a union type and display the
 * appropriate editor in the view builder.
 *
 * @template T - All of the available color names.
 * @template U - The subset of color names to exclude.
 * @returns A new type excluding the specified color names from the total.
 */
export type BaseColorNameType<T, U = undefined> = Exclude<T, U>;
/**
 * Utility type to exclude specific color names from a union type and display the
 * appropriate editor in the view builder.
 *
 * @template T - All of the available color names and shades.
 * @template U - The subset of color names to exclude.
 * @returns A new type excluding the specified color names from the total.
 */
export type BaseColorNameShadeType<T, U = undefined> = Exclude<T, U>;
/**
 * Utility type to expose the horizontal alignment options in the view builder.
 */
export type BaseHorizontalAlignment<T> = T;
/**
 * Utility type to expose the vertical alignment options in the view builder.
 */
export type BaseVerticalAlignment<T> = T;
/**
 * Utility type to expose an edge size model in the view builder, such as for padding.
 */
export type BaseBoxEdgeSizeModel = {
  left?: BaseSize<BaseSizes>;
  top?: BaseSize<BaseSizes>;
  right?: BaseSize<BaseSizes>;
  bottom?: BaseSize<BaseSizes>;
};
/**
 * Utility type to expose a corner size model in the view builder, such as for border radius.
 */
export type BaseBoxCornerSizeModel = {
  topLeft?: BaseSize<BaseSizes>;
  topRight?: BaseSize<BaseSizes>;
  bottomLeft?: BaseSize<BaseSizes>;
  bottomRight?: BaseSize<BaseSizes>;
};
/**
 * Utility type to expose the types of elevations that are possible.
 */
export type BaseElevation<TElevation extends number = number> = TElevation;
/**
 * A utility type to expose a generic box shadow model.
 */
export type BaseBoxShadowModel<T> = {
  x: BaseSize<BaseSizes, `${number}%`>;
  y: BaseSize<BaseSizes, `${number}%`>;
  blur: BaseSize<BaseSizes, `${number}%`>;
  spread: BaseSize<BaseSizes, `${number}%`>;
  color: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | T;
  opacity: BaseOpacityModel;
  inset?: boolean;
}[];
/**
 * Utility type to expose a complete color object selection in the view builder.
 * @template T - The type of colors that can be chosen using BaseColorType or BaseColorNameType.
 * @template U - Optional exclusion from the selection object.
 */
export type BaseColorObjectType<T, U = undefined> = Exclude<
  {
    color: T;
    opacity?: BaseOpacityModel;
  },
  U
>;
/**
 * Utility type to expose a text alignement editor with various options.
 */
export type BaseTextAlignment = 'left' | 'center' | 'right' | 'justify';

export type BaseHorizontalPosition = 'left' | 'right';
export type BaseVerticalPosition = 'top' | 'bottom';
export type BaseTwoAxisPosition = `${BaseVerticalPosition}-${BaseHorizontalPosition}`;
/**
 * Utility type to expose a position editor with various options.
 * @template T - The type of positions that can be chosen.
 */
export type BasePositionType<T> = T;

export type BaseFlexboxDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type BaseFlexboxAlignItems = 'start' | 'center' | 'end' | 'stretch';
export type BaseFlexboxJustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type BaseThreeAxisRotation = {
  x: `${number}deg`;
  y: `${number}deg`;
  z: `${number}deg`;
};

export type BaseHexColor = `#${string}`;
export type BaseRgbColor =
  | `rgb(${number}, ${number}, ${number})`
  | `rgb(${number},${number},${number})`;
export type BaseRgbaColor =
  | `rgba(${number}, ${number}, ${number}, ${number})`
  | `rgba(${number},${number},${number},${number})`;
export type BaseHSLColor =
  | `hsl(${number}, ${number}%, ${number}%)`
  | `hsl(${number},${number}%,${number}%)`;
export type BaseHSLAColor =
  | `hsla(${number}, ${number}% ${number}%, ${number})`
  | `hsla(${number},${number}%,${number}%,${number})`;

/**
 * Utility type to expose a border model in the view builder.
 * @template T - The type of colors that can be chosen using BaseColorType or BaseColorNameType.
 * @template U - Optional exclusion from the base object.
 */
export type BaseBorderModel<T, U = undefined> = Exclude<
  {
    type: 'solid' | 'dashed' | 'dotted';
    width: BaseSize<BaseSizes>;
    color: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | T;
    opacity?: BaseOpacityModel;
  },
  U
>;

/**
 * Utility type to expose a gradient model in the view builder.
 * @template T - The type of colors that can be chosen using BaseColorType or BaseColorNameType.
 * @template U - Optional exclusion from the base object.
 */
export type BaseGradientModel<T, U = undefined> = Exclude<
  {
    type: 'linear' | 'radial' | 'conic';
    startingPoint: {
      degrees?: number;
      sideOrCorner?: BaseHorizontalPosition | BaseVerticalPosition | BaseTwoAxisPosition;
    };
    steps: {
      position: number;
      color: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | T;
      opacity?: BaseOpacityModel;
      interpolationHint?: number;
    }[];
    blur?: number;
  },
  U
>;

export type BaseFilterBlur = {
  type: 'blur';
  value: BaseSize<BaseSizes, `${number}%`>;
};
export type BaseFilterBrightness = {
  type: 'brightness';
  value: `${number}%` | number;
};
export type BaseFilterContrast = {
  type: 'contrast';
  value: `${number}%` | number;
};
export interface BaseFilterGrayscale {
  type: 'grayscale';
  value: `${number}%` | number;
}
export interface BaseFilterHueRotate {
  type: 'hue-rotate';
  value: `${number}deg` | `${number}turn` | `${number}rad` | number;
}
export interface BaseFilterInvert {
  type: 'invert';
  value: `${number}%` | number;
}
export interface BaseFilterOpacity {
  type: 'opacity';
  value: `${number}%` | number;
}
export interface BaseFilterSaturate {
  type: 'saturate';
  value: `${number}%` | number;
}
export interface BaseFilterSepia {
  type: 'sepia';
  value: `${number}%` | number;
}

/**
 * Utility type to expose a dropshadow filter model in the view builder.
 * @template T - The type of colors that can be chosen using BaseColorType or BaseColorNameType.
 */
export type BaseFilterDropshadow<T> = {
  type: 'drop-shadow';
  value: {
    x: BaseSize<BaseSizes, `${number}%`>;
    y: BaseSize<BaseSizes, `${number}%`>;
    blur: BaseSize<BaseSizes, `${number}%`>;
    color: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor | T;
    opacity?: BaseOpacityModel;
  };
};

/**
 * Utility type to expose a filter model in the view builder.
 * @template T - The type of colors that can be chosen using BaseColorType or BaseColorNameType.
 */
export type BaseFilters<T = undefined> =
  | BaseFilterBlur
  | BaseFilterBrightness
  | BaseFilterContrast
  | BaseFilterDropshadow<T>
  | BaseFilterGrayscale
  | BaseFilterHueRotate
  | BaseFilterInvert
  | BaseFilterOpacity
  | BaseFilterSaturate
  | BaseFilterSepia;

type GenericNumericPart = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type GenericNumericSingleDigit = `0.${GenericNumericPart}`;
type GenericNumericDoubleDigit = `0.${GenericNumericPart}${GenericNumericPart}`;
type GenericNumericTripleDigit =
  `0.${GenericNumericPart}${GenericNumericPart}${GenericNumericPart}`;
type GenericNumericFourDigit =
  `0.${GenericNumericPart}${GenericNumericPart}${GenericNumericPart}${GenericNumericPart}`;
type GenericNumericZero = `0`;
type GenericNumericOne = `1`;

/**
 * A utility type that allows values between 0 and 1 with two decimals as strings.
 */
export type GenericZeroToOne =
  | GenericNumericZero
  | GenericNumericSingleDigit
  | GenericNumericDoubleDigit
  | GenericNumericTripleDigit
  | GenericNumericFourDigit
  | GenericNumericOne;

export function convertGenericZeroToOneToNumber(value: GenericZeroToOne): number {
  return parseFloat(value);
}

export function convertNumberToGenericZeroToOne(value: number): GenericZeroToOne {
  const isOneOrIsZero = value === 0 || value === 1;
  const v = (isOneOrIsZero ? `${value}` : value.toFixed(4).toString()) as GenericZeroToOne;
  return v;
}

/**
 * A utility type to let the editor know the opacity control should be displayed.
 */
export type BaseOpacityModel = GenericZeroToOne;

/**
 * A utility type to let the editor know the type of component that can be picked along the type for the property.
 */
export type BaseComponentIdType<T, U> = U | T;

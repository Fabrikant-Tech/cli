import {
  ColorsWithNoShades,
  ColorShadeNameDefault,
  ShortAnimationDuration,
  ColorName,
  ColorShadeName,
  getAllUniqueShadeNames,
  isCSSColor,
} from '../../../global/types/roll-ups';
import {
  BaseBorderModel,
  BaseBoxCornerSizeModel,
  BaseBoxEdgeSizeModel,
  BaseBoxShadowModel,
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseFilters,
  BaseGradientModel,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../../reserved/editor-types';
import { ColorType } from '../../../generated/types/types';

export const toKebabCase = (string: string | undefined) => {
  if (!string) {
    return '';
  }
  return string
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter;
    })
    .join('');
};

export function getColorFromObject(
  color?: BaseColorObjectType<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >,
) {
  if (!color) {
    return undefined;
  }
  const colorValue = color.color;
  const shadeNames = getAllUniqueShadeNames();
  const mightHaveShadeName = colorValue && !ColorsWithNoShades.includes(colorValue);
  const appliedShadeName = shadeNames.find((shade) => colorValue?.includes(shade));
  const shadeName = mightHaveShadeName
    ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
    : '';

  const appliedColorName =
    appliedShadeName && colorValue ? colorValue.replace(`-${appliedShadeName}`, '') : colorValue;
  const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

  const colorVariableString =
    colorValue && isCSSColor(colorValue) ? colorValue : `var(--color-${colorName}${shadeName})`;

  return color.opacity
    ? `color-mix(in srgb, ${colorVariableString} ${Number(color.opacity) * 100}%, transparent)`
    : colorVariableString;
}

export function getEdgeModelValue(value?: BaseBoxEdgeSizeModel) {
  if (!value) {
    return undefined;
  }
  return `${value.top || 0} ${value.right || 0} ${value.bottom || 0} ${value.left || 0}`;
}

export function getCornerModelValue(value?: BaseBoxCornerSizeModel) {
  if (!value) {
    return undefined;
  }
  return `${value.topLeft || 0} ${value.topRight || 0} ${value.bottomRight || 0} ${value.bottomLeft || 0}`;
}

export function getRotationValue(value?: {
  x?: `${number}deg`;
  y?: `${number}deg`;
  z?: `${number}deg`;
}) {
  if (!value) {
    return undefined;
  }
  const x = value.x ? `rotateX(${value.x}) ` : '';
  const y = value.y ? `rotateY(${value.y}) ` : '';
  const z = value.z ? `rotateZ(${value.z}) ` : '';
  return `${x}${y}${z}`;
}

export function getBorderModelValue(
  value?: BaseBorderModel<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >,
) {
  if (!value) {
    return undefined;
  }
  const shadeNames = getAllUniqueShadeNames();
  const propColor = value.color;
  const mightHaveShadeName = propColor && !ColorsWithNoShades.includes(propColor);
  const appliedShadeName = shadeNames.find((shade) => propColor?.includes(shade));
  const shadeName = mightHaveShadeName
    ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
    : '';

  const appliedColorName =
    appliedShadeName && propColor ? propColor.replace(`-${appliedShadeName}`, '') : propColor;
  const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

  const colorOrType =
    propColor && isCSSColor(propColor) ? propColor : `var(--color-${colorName}${shadeName || ''})`;

  return `${value.width} ${value.type} color-mix(in srgb, ${colorOrType} ${value[`opacity`] !== undefined ? Number(value[`opacity`]) * 100 : 100}%, transparent)`;
}

export function getGradientValue(
  value?: BaseGradientModel<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >,
) {
  if (!value) {
    return undefined;
  }

  const isLinear = value[`type`] === 'linear';
  const iteration = value[`steps`]
    .map((step) => {
      const shadeNames = getAllUniqueShadeNames();
      const stepColor = step.color;
      const mightHaveShadeName = stepColor && !ColorsWithNoShades.includes(stepColor);
      const appliedShadeName = shadeNames.find((shade) => stepColor?.includes(shade));
      const shadeName = mightHaveShadeName
        ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
        : '';

      const appliedColorName =
        appliedShadeName && stepColor ? stepColor.replace(`-${appliedShadeName}`, '') : stepColor;
      const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

      const colorOrType =
        stepColor && isCSSColor(stepColor)
          ? stepColor
          : `var(--color-${colorName}${shadeName || ''})`;

      return `color-mix(in srgb, ${colorOrType} ${step[`opacity`] !== undefined ? Number(step[`opacity`]) * 100 : 100}%, transparent) ${
        step[`interpolationHint`] ? `${step[`interpolationHint`]}%` : ''
      } ${step[`position`]}%`;
    })
    .join(',');
  const startingPoint =
    value[`startingPoint`].degrees !== undefined
      ? `${value[`startingPoint`].degrees}deg`
      : `to ${(value[`startingPoint`].sideOrCorner || '').split('-').join(' ')}`;
  const gradient = `${value[`type`]}-gradient(
      ${isLinear ? `${startingPoint},` : ''} ${iteration}
    )`;
  return gradient;
}

export function getFilterValue(
  value?: BaseFilters<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >[],
) {
  if (!value) {
    return undefined;
  }
  return value
    .map((filter) => {
      if (filter.type === 'drop-shadow') {
        const shadeNames = getAllUniqueShadeNames();
        const filterColor = filter.value.color;
        const mightHaveShadeName = filterColor && !ColorsWithNoShades.includes(filterColor);
        const appliedShadeName = shadeNames.find((shade) => filterColor?.includes(shade));
        const shadeName = mightHaveShadeName
          ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
          : '';

        const appliedColorName =
          appliedShadeName && filterColor
            ? filterColor.replace(`-${appliedShadeName}`, '')
            : filterColor;
        const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

        const colorOrType =
          filterColor && isCSSColor(filterColor)
            ? filterColor
            : `var(--color-${colorName}${shadeName || ''})`;

        return `${filter.type}(${filter.value.x} ${filter.value.y} ${filter.value.blur} ${colorOrType})`;
      } else {
        return `${filter.type}(${filter.value})`;
      }
    })
    .join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPropertyValue(key: any, propertySource: any, context: any) {
  const hasProperty = propertySource[key];
  return hasProperty !== undefined ? hasProperty : context[key];
}

export function getTransitionValue(
  transitionDuration?: `${number}ms` | `${number}s`,
  transitionProperty?: Array<keyof CSSStyleDeclaration>,
  transitionEasing?:
    | 'ease-in'
    | 'linear'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | string,
) {
  const duration = transitionDuration || `${ShortAnimationDuration}ms`;
  const easing = transitionEasing || 'linear';
  return transitionProperty
    ? `${transitionProperty.map((k) => toKebabCase(k.toString())).join(transitionProperty.length !== 0 ? ', ' : '')} ${duration} ${easing}`
    : undefined;
}

export function getBoxShadowValue(
  shadow: BaseBoxShadowModel<
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >,
) {
  let shadowString = '';
  shadow.forEach((s, i) => {
    const shouldAddComma = i !== shadow.length - 1 && shadow.length - 1 !== 0;
    const inset = s.inset;
    const x = s.x;
    const y = s.y;
    const blur = s.blur;
    const spread = s.spread;
    const c = getColorFromObject({
      color: s.color,
      opacity: s.opacity,
    });
    shadowString = `${shadowString}${inset ? 'inset ' : ''}${x} ${y} ${blur} ${spread} ${c}${shouldAddComma ? ',' : ''}`;
  });
  return shadowString;
}

export function getMaxSize(element: HTMLBrContainerElement, property: 'width' | 'height') {
  const parentSize = element.parentElement?.getBoundingClientRect()[property];
  const computedStyle = window.getComputedStyle(element);
  const maxSize = computedStyle[property === 'width' ? 'maxWidth' : 'maxHeight'];
  const containsPercentage = maxSize.includes('%');
  if (maxSize === 'none') {
    return undefined;
  }
  return containsPercentage
    ? (parentSize || 0) * (Number(maxSize.replace('%', '')) / 100)
    : Number(maxSize.replace('px', ''));
}

export function getMinSize(element: HTMLBrContainerElement, property: 'width' | 'height') {
  const parentSize = element.parentElement?.getBoundingClientRect()[property];
  const computedStyle = window.getComputedStyle(element);
  const minSize = computedStyle[property === 'width' ? 'minWidth' : 'minHeight'];
  const containsPercentage = minSize.includes('%');
  if (minSize === 'none') {
    return undefined;
  }
  return containsPercentage
    ? (parentSize || 0) * (Number(minSize.replace('%', '')) / 100)
    : Number(minSize.replace('px', ''));
}

export function convertStyleAttributeToObject(styleString: string | null): Record<string, string> {
  const styles: Record<string, string> = {};
  if (styleString) {
    styleString.split(';').forEach((styleRule) => {
      const [property, value] = styleRule.split(':').map((item) => item.trim());
      if (property && value) {
        styles[property] = value;
      }
    });
  }
  return styles;
}

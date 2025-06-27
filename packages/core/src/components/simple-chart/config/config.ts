import {
  Colors,
  SizeUnit,
  ThemeDefault,
  TypographyBodyFamily,
} from '../../../generated/types/variables';
import { Theme } from '../../../generated/types/types';

export const getChartConfig = (theme?: Theme) => {
  function generateSvgPath(width: number, height: number, borderRadius: number) {
    const maxRadius = Math.min(width / 2, height / 2);
    const radius = Math.min(borderRadius, maxRadius);

    return `
      M ${radius},0 
      H ${width - radius} 
      A ${radius},${radius} 0 0 1 ${width},${radius} 
      V ${height - radius} 
      A ${radius},${radius} 0 0 1 ${width - radius},${height} 
      H ${radius} 
      A ${radius},${radius} 0 0 1 0,${height - radius} 
      V ${radius} 
      A ${radius},${radius} 0 0 1 ${radius},0 
      Z
    `.trim();
  }

  const themeToUse = theme || ThemeDefault;

  const sizeUnit = Number(SizeUnit.replace('px', ''));

  const labelFontSize = Math.round(sizeUnit * 3);

  const axisLightColor = `color-mix(in srgb, ${Colors.Light.Neutral[900]} 15%, transparent)`;
  const splitAreaLightColor = `color-mix(in srgb, ${Colors.Light.Neutral[900]} 5%, transparent)`;
  const axisSplitLineLightColor = `color-mix(in srgb, ${Colors.Light.Neutral[900]} 7.5%, transparent)`;
  const axisLabelLightColor = `color-mix(in srgb, ${Colors.Light.Neutral[900]} 65%, transparent)`;

  const axisDarkColor = `color-mix(in srgb, ${Colors.Light.Neutral[100]} 10%, transparent)`;
  const splitAreaDarkColor = `color-mix(in srgb, ${Colors.Light.Neutral[100]} 3.33%, transparent)`;
  const axisSplitLineDarkColor = `color-mix(in srgb, ${Colors.Light.Neutral[100]} 5%, transparent)`;
  const axisLabelDarkColor = `color-mix(in srgb, ${Colors.Light.Neutral[100]} 45%, transparent)`;

  const genericAxisConfiguration = {
    axisLine: {
      show: true,
      lineStyle: {
        color: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
      },
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
      },
    },
    axisLabel: {
      show: true,
      fontFamily: TypographyBodyFamily,
      fontSize: labelFontSize,
      padding: sizeUnit / 2,
      lineHeight: labelFontSize,
      color: themeToUse === 'Light' ? axisLabelLightColor : axisLabelDarkColor,
      overflow: 'breakAll',
      ellipsis: '...',
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: [themeToUse === 'Light' ? axisSplitLineLightColor : axisSplitLineDarkColor],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['transparent', themeToUse === 'Light' ? splitAreaLightColor : splitAreaDarkColor],
      },
    },
    axisPointer: {
      label: {
        fontFamily: TypographyBodyFamily,
        show: true,
        fontSize: labelFontSize,
        padding: sizeUnit * 2,
        margin: 0,
        lineHeight: labelFontSize,
        color: themeToUse === 'Dark' ? Colors[ThemeDefault].Black : Colors[ThemeDefault].White,
        borderRadius: sizeUnit * 2,
        borderWidth: 0,
        backgroundColor: `color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent)`,
      },
      lineStyle: {
        color: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
      },
    },
    tooltip: {
      show: true,
    },
  };
  const lightTheme = {
    title: {
      textStyle: {
        color: Colors[ThemeDefault].Black,
      },
      subtextStyle: {
        color: Colors[ThemeDefault].Neutral[500],
      },
    },
    color:
      themeToUse === 'Light'
        ? [
            Colors.Light.Primary[500],
            Colors.Light.Constructive[500],
            Colors.Light.Warning[500],
            Colors.Light.Destructive[500],
            Colors.Light.Neutral[500],
            Colors.Light.Primary[700],
            Colors.Light.Constructive[700],
            Colors.Light.Warning[700],
            Colors.Light.Destructive[700],
            Colors.Light.Neutral[700],
          ]
        : [
            Colors.Light.Primary[300],
            Colors.Light.Constructive[300],
            Colors.Light.Warning[300],
            Colors.Light.Destructive[300],
            Colors.Light.Neutral[300],
            Colors.Light.Primary[500],
            Colors.Light.Constructive[500],
            Colors.Light.Warning[500],
            Colors.Light.Destructive[500],
            Colors.Light.Neutral[500],
          ],
    categoryAxis: genericAxisConfiguration,
    valueAxis: genericAxisConfiguration,
    logAxis: genericAxisConfiguration,
    timeAxis: genericAxisConfiguration,
    legend: {
      itemWidth: labelFontSize,
      itemHeight: labelFontSize,
      textStyle: {
        color: themeToUse === 'Light' ? Colors[ThemeDefault].Black : Colors[ThemeDefault].White,
        fontFamily: TypographyBodyFamily,
        lineHeight: labelFontSize,
        fontSize: labelFontSize,
      },
    },
    visualMap: {
      padding: sizeUnit * 3,
      handleIcon: `path://${generateSvgPath(sizeUnit * 4, (sizeUnit * 4) / 3, sizeUnit / 2)}`,
      indicatorIcon: `path://${generateSvgPath(sizeUnit, sizeUnit, sizeUnit / 2)}`,
      indicatorSize: '25%',
      handleSize: '100%',
      textGap: sizeUnit * 2,
      hoverLinkOnHandle: false,
      indicatorStyle: {
        borderWidth: 2,
        shadowColor: 'rgba(0,0,0,0)',
        borderColor: `color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent)`,
      },
      handleStyle: {
        borderWidth: 2,
        shadowColor: 'rgba(0,0,0,0)',
        borderColor: `color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent)`,
      },
      textStyle: {
        fontFamily: TypographyBodyFamily,
        fontSize: labelFontSize,
        color: themeToUse === 'Light' ? Colors[ThemeDefault].Black : Colors[ThemeDefault].White,
      },
      outOfRange: {
        opacity: 0.25,
        colorSaturation: 0.25,
        color: [
          Colors.Light.Constructive[500],
          Colors.Light.Warning[500],
          Colors.Light.Destructive[500],
        ],
      },
      controller: {
        outOfRange: {
          color: themeToUse === 'Light' ? ['rgba(0,0,0,0.25)'] : ['rgba(255,255,255,0.25)'],
        },
      },
    },
    tooltip: {
      borderWidth: 0,
      textStyle: {
        fontFamily: TypographyBodyFamily,
        fontSize: labelFontSize,
        color: `var(--color-tooltip-color)`,
      },
      extraCssText: `
        background-color: color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent);
        backdrop-filter: blur(calc(var(--template-shadow-blur) * 2));
        padding: var(--popover-element-padding);
        border-radius: var(--popover-element-border-radius);`,
    },
    dataZoom: {
      backgroundColor: 'transparent',
      borderColor: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
      moveHandleSize: sizeUnit * 2,
      handleStyle: {
        color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
        borderColor: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
      },
      moveHandleStyle: {
        color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
        borderColor: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
        borderWidth: 1,
      },
      emphasis: {
        handleStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
          borderColor: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
          borderWidth: 1,
        },
        moveHandleStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
          borderColor: themeToUse === 'Light' ? axisLightColor : axisDarkColor,
          borderWidth: 1,
        },
      },
      borderRadius: sizeUnit,
      dataBackground: {
        lineStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
          width: 1,
        },
        areaStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Neutral[200] : Colors.Light.Neutral[700],
        },
      },
      brushStyle: {
        color: themeToUse === 'Light' ? Colors.Light.Primary[500] : Colors.Light.Primary[300],
        opacity: 0.25,
      },
      textStyle: {
        fontFamily: TypographyBodyFamily,
        fontSize: labelFontSize,
        color: `var(--color-tooltip-color)`,
        backgroundColor: `color-mix(in srgb, var(--color-tooltip-background) var(--tooltip-element-background-transparency), transparent`,
        padding: sizeUnit * 2,
        borderRadius: sizeUnit * 2,
      },
      selectedDataBackground: {
        lineStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Primary[500] : Colors.Light.Primary[300],
          width: 1,
        },
        areaStyle: {
          color: themeToUse === 'Light' ? Colors.Light.Primary[500] : Colors.Light.Primary[300],
        },
      },
      fillerColor: 'transparent',
    },
  };
  return {
    version: 1,
    themeName: 'customed',
    theme: themeToUse === 'Light' ? lightTheme : lightTheme,
  };
};

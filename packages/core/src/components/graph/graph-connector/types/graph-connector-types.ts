import { ColorName, ColorShadeName } from '../../../../global/types/roll-ups';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorShadeType,
  BaseColorType,
} from '../../../../reserved/editor-types';
import { ColorType } from '../../../../generated/types/types';

export type GraphConnectorCurveString = 'direct' | 'curved';
export type GraphConnectorCurve =
  | GraphConnectorCurveString
  | ((startX: number, startY: number, endX: number, endY: number) => string);

export type GraphConnectorSingleStroke = {
  type: 'single';
  color:
    | BaseColorNameType<ColorName>
    | BaseColorType<
        | ColorType
        | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
        | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
      >;
  opacity?: number;
};
export type GraphConnectorMultiStroke = {
  type: 'multi';
  steps: {
    position: number;
    color:
      | BaseColorNameType<ColorName>
      | BaseColorType<ColorType>
      | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
      | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>;
    opacity?: number;
  }[];
};
export type GraphConnectorStroke = GraphConnectorSingleStroke | GraphConnectorMultiStroke;

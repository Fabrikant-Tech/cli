type ChartDataZoomEventDataDetails = {
  type: 'datazoom';
  end: number;
  start: number;
  startValue?: number;
  endValue?: number;
} & {
  [key: string]: unknown;
};
export type ChartDataZoomEventData =
  | {
      type: 'datazoom';
      batch?: Array<Omit<ChartDataZoomEventDataDetails, 'type'>>;
    }
  | ChartDataZoomEventDataDetails;

export type ChartLegendSelectionEventData = {
  type: 'legendselectchanged';
  name: string; // The currently selected series
  selected: Record<string, boolean>; // The current selection state
};

export interface ChartColorGradientLinear {
  type: 'linear';
  x: number;
  y: number;
  x2: number;
  y2: number;
  colorStops: {
    offset: number;
    color: `#${string}` | `rgba(${number}, ${number}, ${number}, ${number})`;
  }[];
}
export interface ChartColorGradientRadial {
  type: 'radial';
  x: number;
  y: number;
  r: number;
  colorStops: {
    offset: number;
    color: `#${string}` | `rgba(${number}, ${number}, ${number}, ${number})`;
  }[];
}
export interface ChartColorPattern {
  type: 'pattern';
  image: HTMLImageElement | HTMLCanvasElement;
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
}
export type ChartFillColor =
  | ChartColorGradientLinear
  | ChartColorGradientRadial
  | ChartColorPattern;

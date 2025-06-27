export type GridTemplateColumnBaseSize = `${number}px` | `${number}fr` | `${number}%` | 'auto';
export type GridTemplateColumnSize =
  | Array<GridTemplateColumnBaseSize>
  | `repeat(${number}, ${GridTemplateColumnBaseSize})`
  | `repeat(${number}, ${GridTemplateColumnBaseSize})`
  | `minMax(${GridTemplateColumnBaseSize}, ${GridTemplateColumnBaseSize} ${GridTemplateColumnBaseSize}`;

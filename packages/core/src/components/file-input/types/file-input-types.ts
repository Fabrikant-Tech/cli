export const maxFileSizeErrorMessage = (value: string) =>
  `One of the uploaded files exceeds ${value}.`;
export const convertBytes = (target: 'Gb' | 'Mb' | 'Kb' | 'b', value: number) => {
  const formatNumber = (v: number) => parseFloat(v.toString()).toFixed(2);
  switch (target) {
    case 'Gb':
      return formatNumber(value / (1024 * 1024 * 1024));
    case 'Mb':
      return formatNumber(value / (1024 * 1024));
    case 'Kb':
      return formatNumber(value / 1024);
    default:
      return formatNumber(value);
  }
};

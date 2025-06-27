export const calculatePositionFromValue = (
  parentSliderRef: HTMLBrSliderElement | null,
  value: number,
) => {
  if (!parentSliderRef) {
    return 0;
  }
  const limits = {
    min: parentSliderRef.min,
    max: parentSliderRef.max,
  };
  const totalValueLength =
    limits.min < 0 ? Math.abs(limits.min) + Math.abs(limits.max) : limits.max - limits.min;
  const positiveLimitValue = value - Math.abs(limits.min);
  const negativeLimitValue =
    value < 0 ? Math.abs(limits.min) - Math.abs(value) : Math.abs(limits.min) + Math.abs(value);
  const valueToCheck = limits.min < 0 ? negativeLimitValue : positiveLimitValue;
  return (valueToCheck / totalValueLength) * 100;
};

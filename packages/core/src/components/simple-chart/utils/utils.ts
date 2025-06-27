import { isEqual } from 'lodash-es';

export async function getChartInstanceFromComponent(chartComponent: HTMLBrSimpleChartZoomElement) {
  const chartElement = chartComponent.closest('br-simple-chart');
  if (!chartElement) {
    return;
  }
  return await chartElement.getChartInstance();
}

export async function updateChartInstanceFromComponent(
  chartComponent: HTMLBrSimpleChartZoomElement,
  optionsToUpdate: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  componentType: 'dataZoom',
  updateByIndex: number | undefined,
) {
  const chartElement = chartComponent.closest('br-simple-chart');
  if (!chartElement) {
    return;
  }
  const chartInstance = await chartElement.getChartInstance();
  if (!chartInstance) {
    return;
  }
  const currentChartOptions = chartInstance.getOption();

  const currentValues = currentChartOptions[componentType];
  if (!currentValues) {
    console.error('WARNING Could not find the component type in the chart options', componentType);
    return;
  }
  let newValues;
  if (updateByIndex !== undefined) {
    const currentValuesArray = Array.isArray(currentValues) ? currentValues : [currentValues];
    const updatedValuesArray = currentValuesArray.map((currentValue, index) => {
      if (index === updateByIndex) {
        return {
          ...currentValue,
          ...optionsToUpdate,
        };
      }
      return currentValue;
    });
    newValues = updatedValuesArray;
  } else {
    newValues = {
      ...currentValues,
      ...optionsToUpdate,
    };
  }

  if (!isEqual(currentValues, newValues)) {
    console.error('not equal, should update', currentValues, newValues);
    chartInstance.setOption({
      [componentType]: newValues,
    });
  }
}

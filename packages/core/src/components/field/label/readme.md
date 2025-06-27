# Field label



<!-- Auto Generated Below -->


## Overview

The field label is used to display the label in the field element.

## Properties

| Property            | Attribute             | Description                                                           | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Default        |
| ------------------- | --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `associatedInputId` | `associated-input-id` | Determines the id of the input that the component is associated with. | `string \| HTMLBrTreeElement \| HTMLBrTimeInputElement \| HTMLTextAreaElement \| HTMLBrTagInputElement \| HTMLBrSwitchElement \| HTMLBrSliderElement \| HTMLBrSingleSelectElement \| HTMLBrSelectListElement \| HTMLBrButtonElement \| HTMLBrRadioElement \| HTMLBrNumericInputElement \| HTMLBrMultiSelectElement \| HTMLBrInputElement \| HTMLBrFileUploadElement \| HTMLBrFileInputElement \| HTMLBrTimePickerElement \| HTMLBrDateInputElement \| HTMLBrComboSelectElement \| HTMLBrColorInputElement \| HTMLBrCheckboxElement \| HTMLBrDatePickerElement` | `undefined`    |
| `requiredDisplay`   | `required-display`    | Defines if the required affordance is displayed and if yes how.       | `"optional" \| "required" \| boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `'required'`   |
| `size`              | `size`                | Defines the size style applied to the component.                      | `"Large" \| "Normal" \| "Small"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `'Normal'`     |
| `theme`             | `theme`               | Defines the theme of the component.                                   | `"Dark" \| "Light"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `ThemeDefault` |


## Slots

| Slot                   | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
|                        | A slot to pass the label content to the field label element. |
| `"decorator"`          | A slot to pass custom content after the label.               |
| `"required-decorator"` | A slot to pass custom content to the required decorator.     |


----------------------------------------------



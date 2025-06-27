export interface CustomValidator<T> {
  // The name of the validator
  name: string;
  // A function that takes in the value as a parameter and return true if the value is invalid
  isInvalid: (value: T) => boolean;
  // The error message
  errorMessage: string;
}

export type ErrorKey =
  | 'badInput'
  | 'customError'
  | 'patternMismatch'
  | 'rangeOverflow'
  | 'rangeUnderflow'
  | 'stepMismatch'
  | 'tooLong'
  | 'tooShort'
  | 'typeMismatch'
  | 'valid'
  | 'valueMissing';

export const CustomErrorMessages: Record<Exclude<ErrorKey, 'customError' | 'valid'>, string> = {
  badInput: 'Unable to convert the input.',
  patternMismatch: 'Value does not match the pattern.',
  rangeOverflow: 'Value is above the maximum',
  rangeUnderflow: 'Value is below the minimum.',
  stepMismatch: 'Value does not adhere to the step.',
  tooLong: 'Value is too long.',
  tooShort: 'Value is too short.',
  typeMismatch: 'Value is not in the correct format.',
  valueMissing: 'Value required.',
};

export type FormNativeError = {
  type: 'native';
  valid: boolean;
  error: string;
};
export type FormCustomError = {
  type: 'custom';
  valid: boolean;
  firstError?: string;
  nativeErrors?: { [key: string]: string };
  customErrors?: { [key: string]: string };
};
export type FormValidity = {
  valid: boolean;
  errors?: {
    [key: string]: FormCustomError | FormNativeError;
  };
};

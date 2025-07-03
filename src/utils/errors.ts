import type { ExitError } from '@oclif/core/errors';

class ApiError extends Error {
  public status: number;
  public code: string;
  public message: string;

  static fromResponseJson = (error: unknown, message?: string): ApiError => {
    if (typeof error !== 'object' || error === null || Array.isArray(error)) {
      return new ApiError(
        500,
        'unknown',
        'An unknown error occurred. Contact us at help@designbase.com if the problem persists.'
      );
    }

    const status = 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const code = 'code' in error && typeof error.code === 'string' ? error.code : 'unknown';
    const _message =
      message ??
      ('message' in error && typeof error.message === 'string'
        ? error.message
        : 'Something went wrong');
    return new ApiError(status, code, _message);
  };

  constructor(status: number, code: string, message?: string) {
    super();
    this.name = this.constructor.name;

    this.status = status;
    this.code = code;
    this.message = message ?? 'Something went wrong';
  }
}

const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

const isExitPromptError = (error: unknown) =>
  isNonArrayObject(error) && 'name' in error && error.name === 'ExitPromptError';

const isExitError = (error: unknown): error is ExitError =>
  isNonArrayObject(error) && 'code' in error && error.code === 'EEXIT';

const isNonArrayObject = (error: unknown): error is object =>
  typeof error === 'object' && error !== null && !Array.isArray(error);

export { ApiError, isApiError, isExitError, isExitPromptError };

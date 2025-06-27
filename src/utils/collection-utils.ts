import { isEmpty } from 'lodash-es';

/**
 * Utility function for type guarding that a value is non-null and has a value (according to the same rules
 * as `isEmpty` from `lodash`)
 */
const isNotEmpty = <T extends T[] | object | string>(value: T | null | undefined): value is T =>
  !isEmpty(value);

export { isNotEmpty };

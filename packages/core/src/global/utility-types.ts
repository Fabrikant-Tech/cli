/**
 * Picks out all non-function keys of an HTML element interface for use in composing other types.
 */
export type PropsOf<T extends HTMLElement> = Pick<T, NonFunctionKeys<T>>;

/**
 * NonFunctionKeys
 * @desc Get union type of keys that are non-functions in object type `T`
 * @example
 *   type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "name | someKey"
 *   type Keys = NonFunctionKeys<MixedProps>;
 */
export type NonFunctionKeys<T extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K;
}[keyof T];

/**
 * NonUndefined
 * @desc Exclude undefined from set `A`
 * @example
 *   // Expect: "string | null"
 *   SymmetricDifference<string | null | undefined>;
 */
export type NonUndefined<A> = A extends undefined ? never : A;

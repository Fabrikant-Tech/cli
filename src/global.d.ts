/* eslint-disable collation/no-default-export -- We can't control how the packages we consume export their public API  */

declare module 'node-pager' {
  /**
   * Opens the provided output in `less`, a pager for quickly scanning up/down large outputs.
   */
  function pager(output: string): Promise<void>;

  export default pager;
}

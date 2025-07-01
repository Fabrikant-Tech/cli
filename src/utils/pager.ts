// @ts-expect-error
import _pager from 'node-pager';

/**
 * Opens the provided output in `less`, a pager for quickly scanning up/down large outputs.
 */
const pager = _pager as (output: string) => Promise<void>;

export { pager };

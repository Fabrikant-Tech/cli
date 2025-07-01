/**
 * Shape of a select choice object, since `@inquirer/prompts` does not export it.
 */
interface SelectChoice<Value> {
  /**
   * Value of the item when selected, like an id.
   */
  value: Value;

  /**
   * Display-friendly name of the value
   */
  name?: string;

  /**
   * Additional description that is displayed below the option when it is focused
   */
  description?: string;

  short?: string;
  disabled?: boolean | string;
  type?: never;
}

export type { SelectChoice };

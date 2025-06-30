import { ux } from '@oclif/core';

const primary = (text: string | number | boolean) => ux.colorize('#a713f6', text.toString());

const warning = (text: string | number | boolean) => ux.colorize('#f38e1a', text.toString());

const destructive = (text: string | number | boolean) => ux.colorize('#e43b3b', text.toString());

const constructive = (text: string | number | boolean) => ux.colorize('#55b32c', text.toString());

const neutral = (text: string | number | boolean) => ux.colorize('#656682', text.toString());

export { constructive, destructive, neutral, primary, warning };

import { Size } from '../../../../generated/types/types';

export const TIMELINE_ITEM_DEFAULT_PROPS: {
  headingSize: Record<Exclude<Size, 'Xsmall'>, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
} = {
  headingSize: {
    Small: 'h6',
    Normal: 'h5',
    Large: 'h4',
  },
};

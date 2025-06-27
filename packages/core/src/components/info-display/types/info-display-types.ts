import { Size } from '../../../generated/types/types';

export const INFO_DISPLAY_DEFAULT_PROPS: {
  headingSize: Record<Size, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
} = {
  headingSize: {
    Xsmall: 'h6',
    Small: 'h6',
    Normal: 'h5',
    Large: 'h4',
  },
};

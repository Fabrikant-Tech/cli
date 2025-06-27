import { Size } from '../../../generated/types/types';

export type SkeletonSize = Exclude<Size, undefined>;

export const SKELETON_DEFAULT_PROPS: {
  size: SkeletonSize;
} = {
  size: 'Normal',
};

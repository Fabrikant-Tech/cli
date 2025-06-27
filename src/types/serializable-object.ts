import type { Primitive } from './primitive.js';
import type { SerializableArray } from './serializable-array.js';

interface SerializableObject {
  [key: string]: Primitive | SerializableArray | SerializableObject | null | undefined;
}

export type { SerializableObject };

import type { Primitive } from './primitive.js';
import type { SerializableObject } from './serializable-object.js';

type SerializableArray<T extends Primitive | SerializableObject = Primitive | SerializableObject> =
  Array<T>;

export type { SerializableArray };

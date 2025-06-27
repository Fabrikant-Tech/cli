import { VNode } from '@stencil/core';

/**
 * DesignbaseComponentExample is a type that represents the definition of a component preview.
 * @template T - The type of the parameters that the preview accepts. Where T can be a structure of key value pairs. Values should be DBExampleParameterType.
 */
export interface DesignbaseComponentExample<T = undefined> {
  name: string;
  description?: string;
  params?: T;
  render: (params?: T) => VNode;
}

export enum DBExampleGenerators {
  UNIQUE_ID = 'uniqueId',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  X_COUNT = 'xCount',
  Y_COUNT = 'yCount',
  PARENT_ID = 'parentId',
}

export const DBExampleGeneratorDefaultValues = {
  [`${DBExampleGenerators.UNIQUE_ID}`]: 'id',
  [`${DBExampleGenerators.STRING}`]: 'string',
  [`${DBExampleGenerators.NUMBER}`]: 123,
  [`${DBExampleGenerators.BOOLEAN}`]: true,
  [`${DBExampleGenerators.X_COUNT}`]: 4,
  [`${DBExampleGenerators.Y_COUNT}`]: 6,
  [`${DBExampleGenerators.PARENT_ID}`]: 'parentId',
};

export interface DBExampleUniqueIdGenerator {
  type: 'uniqueId';
  value: () => string;
}

export interface DBExampleStringGenerator {
  type: 'string';
  value: () => string;
}

export interface DBExampleNumberGenerator {
  type: 'number';
  value: () => number;
}

export interface DBExampleXCountGenerator {
  type: 'xCount';
  value: () => number;
}

export interface DBExampleYCountGenerator {
  type: 'yCount';
  value: () => number;
}

export interface DBExampleBooleanGenerator {
  type: 'boolean';
  value: () => boolean;
}

export interface DBExampleParentIdGenerator {
  type: 'parentId';
  tagName: string;
  value: () => string;
}

export type DBExampleParameterType =
  | DBExampleUniqueIdGenerator
  | DBExampleStringGenerator
  | DBExampleNumberGenerator
  | DBExampleBooleanGenerator
  | DBExampleXCountGenerator
  | DBExampleYCountGenerator
  | DBExampleParentIdGenerator;

export const DefaultDBUniqueIDGenerator: DBExampleUniqueIdGenerator = {
  type: DBExampleGenerators.UNIQUE_ID,
  value: () => DBExampleGeneratorDefaultValues.uniqueId,
};
export const DefaultDBStringGenerator: DBExampleStringGenerator = {
  type: DBExampleGenerators.STRING,
  value: () => DBExampleGeneratorDefaultValues.string,
};
export const DefaultDBNumberGenerator: DBExampleNumberGenerator = {
  type: DBExampleGenerators.NUMBER,
  value: () => DBExampleGeneratorDefaultValues.number,
};
export const DefaultDBBooleanGenerator: DBExampleBooleanGenerator = {
  type: DBExampleGenerators.BOOLEAN,
  value: () => DBExampleGeneratorDefaultValues.boolean,
};
export const DefaultDBXCountGenerator: DBExampleXCountGenerator = {
  type: DBExampleGenerators.X_COUNT,
  value: () => DBExampleGeneratorDefaultValues.xCount,
};
export const DefaultDBYCountGenerator: DBExampleYCountGenerator = {
  type: DBExampleGenerators.Y_COUNT,
  value: () => DBExampleGeneratorDefaultValues.yCount,
};
export const DefaultDBParentIdGenerator: DBExampleParentIdGenerator = {
  type: DBExampleGenerators.PARENT_ID,
  tagName: 'tagName',
  value: () => DBExampleGeneratorDefaultValues.parentId,
};

export const DefaultDBExampleGenerators = {
  [DBExampleGenerators.UNIQUE_ID]: DefaultDBUniqueIDGenerator,
  [DBExampleGenerators.STRING]: DefaultDBStringGenerator,
  [DBExampleGenerators.NUMBER]: DefaultDBNumberGenerator,
  [DBExampleGenerators.BOOLEAN]: DefaultDBBooleanGenerator,
  [DBExampleGenerators.X_COUNT]: DefaultDBXCountGenerator,
  [DBExampleGenerators.Y_COUNT]: DefaultDBYCountGenerator,
  [DBExampleGenerators.PARENT_ID]: DefaultDBParentIdGenerator,
};

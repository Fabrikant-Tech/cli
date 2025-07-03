interface ChangeStreamEvent<TDto> {
  removedFields?: Array<keyof TDto>;
  updatedFields?: Partial<TDto>;
}

export type { ChangeStreamEvent };

interface CreatableDto {
  /**
   * Timestamp when the entity was created
   */
  createdAt: string;

  /**
   * Id of the user who created the entity
   */
  createdBy: string;
}

export type { CreatableDto };

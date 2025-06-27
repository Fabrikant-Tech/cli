interface UpdatableDto {
  /**
   * Timestamp when the entity was last updated
   */
  updatedAt?: string;

  /**
   * Id of the user who last updated the entity
   */
  updatedBy?: string;
}

export type { UpdatableDto };

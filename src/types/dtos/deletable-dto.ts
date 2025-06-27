interface DeletableDto {
  /**
   * Timestamp when the entity was deleted
   */
  deletedAt?: string;

  /**
   * Id of the user who deleted the entity
   */
  deletedBy?: string;
}

export type { DeletableDto };

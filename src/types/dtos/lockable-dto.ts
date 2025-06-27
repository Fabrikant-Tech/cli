interface LockableDto {
  /**
   * Id of the user who owns the lock to the entity
   */
  lockedBy?: string;
  /**
   * Timestamp until the lock is valid for
   */
  lockExpiresAt?: string;
}

export type { LockableDto };

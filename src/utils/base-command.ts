import { Command } from '@oclif/core';
import { isExitError, isExitPromptError } from './errors.js';

abstract class BaseCommand extends Command {
  async catch(error: Error & { exitCode?: number | undefined }): Promise<void> {
    if (isExitPromptError(error) || isExitError(error)) {
      return;
    }

    this.error(error);
  }
}

/**
 * Exit errors that are thrown inside of the socket callback are not caught by the `BaseCommand` handler,
 * and will print an ugly error by default. We just want to handle that as a normal exit without throwing an error.
 */
process.on('uncaughtException', (error) => {
  if (isExitError(error)) {
    process.exit(error.oclif.exit);
  }
});

export { BaseCommand };

import { Command, Errors } from '@oclif/core';
import { isExitError, isExitPromptError } from './errors.js';

abstract class BaseCommand extends Command {
  async catch(error: Error & { exitCode?: number | undefined }): Promise<void> {
    if (isExitPromptError(error) || isExitError(error)) {
      return;
    }

    this.error(error);
  }
}

export { BaseCommand };

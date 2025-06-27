import { Command } from '@oclif/core';
import { isExitPromptError } from './errors.js';

abstract class BaseCommand extends Command {
  async catch(error: Error & { exitCode?: number | undefined }): Promise<void> {
    if (isExitPromptError(error)) {
      return;
    }

    this.error(error);
  }
}

export { BaseCommand };

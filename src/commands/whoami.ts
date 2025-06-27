import { getCurrentUser } from '../utils/api.js';
import { readCredentialsFile } from '../utils/auth-utils.js';
import { isExitPromptError } from '../utils/errors.js';
import { primary, warning } from '../utils/colorize.js';
import { BaseCommand } from '../utils/base-command.js';

class WhoAmI extends BaseCommand {
  static args = {};
  static description = 'Check your authentication status';
  static examples = [];
  static flags = {};

  async run(): Promise<void> {
    const token = await readCredentialsFile();
    if (token !== undefined) {
      try {
        const user = await getCurrentUser({ token });
        this.log(`You are currently logged in as ${primary(user.email)}.`);
        return;
      } catch (error) {
        if (isExitPromptError(error)) {
          return;
        }

        this.logToStderr(warning('Your login token is invalid or expired. Please login again.'));
        this.exit(1);
      }
    }

    this.logToStderr(
      warning(
        `You are not currently logged in. Run ${primary('designbase login')} to authenticate.`
      )
    );
    this.exit(1);
  }
}

export { WhoAmI };

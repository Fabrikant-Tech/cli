import { input, password as passwordInput, confirm } from '@inquirer/prompts';
import { getCurrentUser, login } from '../utils/api.js';
import { readCredentialsFile, writeCredentialsFile } from '../utils/auth-utils.js';
import { isExitPromptError } from '../utils/errors.js';
import { constructive, destructive, primary, warning } from '../utils/colorize.js';
import { BaseCommand } from '../utils/base-command.js';

class Login extends BaseCommand {
  static description = 'Authenticate with the Designbase app';

  async run(): Promise<void> {
    const token = await readCredentialsFile();
    if (token !== undefined) {
      try {
        const user = await getCurrentUser({ token });
        const shouldContinue = await confirm({
          message: `You are already logged in as ${primary(user.email)}. Do you want to login anyway?`,
        });
        if (!shouldContinue) {
          return;
        }
      } catch (error) {
        if (isExitPromptError(error)) {
          return;
        }

        this.logToStderr(warning('Your login token is invalid or expired. Please login again.'));
      }
    }

    try {
      const email = await input({ message: 'Email:' });
      const password = await passwordInput({ message: 'Password:', mask: true });

      const user = await login({ email, password });
      if (user.token === undefined) {
        this.error(
          destructive(
            'Login was successful, but no token was returned. This is an unexpected error. Contact us at help@designbase.com if the problem persists.'
          )
        );
      }

      await writeCredentialsFile(user.token);
      this.log(constructive(`Successfully logged in as ${primary(user.email)}.`));
    } catch (error) {
      if (isExitPromptError(error)) {
        return;
      }

      if (error instanceof Error) {
        const message = destructive(error.message);
        this.error(message);
      }

      this.error(
        destructive(
          "We weren't able to log you in at this time. Please confirm you are using the right email and password, or contact us at help@designbase.com if the problem persists."
        )
      );
    }
  }
}

export { Login };

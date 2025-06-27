import path from 'node:path';
import os from 'node:os';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { primary } from './colorize.js';
import { getCurrentUser } from './api.js';
import { isApiError } from './errors.js';

const credentialsFilePath = path.join(os.homedir(), '.config', 'designbase', 'credentials');

const writeCredentialsFile = async (token: string): Promise<void> => {
  await mkdir(path.dirname(credentialsFilePath), { recursive: true });
  await writeFile(credentialsFilePath, token, 'utf-8');
};

const readCredentialsFile = async (): Promise<string | undefined> => {
  try {
    const token = await readFile(credentialsFilePath, 'utf-8');
    return token;
  } catch (error) {
    return undefined;
  }
};

const getCredentialsOrThrow = async (): Promise<string> => {
  const token = await readCredentialsFile();
  if (token === undefined) {
    throw new Error(
      `You are not currently logged in. Run ${primary('designbase login')} to authenticate.`
    );
  }

  try {
    await getCurrentUser({ token });
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    throw new Error(
      `Unable to verify authentication status. Run ${primary('designbase login')} to re-authenticate, or contact us at help@designbase.com if the problem persists.`
    );
  }

  return token;
};

export { getCredentialsOrThrow, readCredentialsFile, writeCredentialsFile };

import path from 'node:path';
import os from 'node:os';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { destructive, primary } from './colorize.js';
import { getCurrentUser } from './api.js';
import { isApiError } from './errors.js';
import type { UserDto } from '../types/index.js';

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

const getCredentialsOrThrow = async (): Promise<Omit<UserDto, 'token'> & { token: string }> => {
  const token = await readCredentialsFile();
  if (token === undefined) {
    throw new Error(
      `You are not currently logged in. Run ${primary('designbase login')} to authenticate.`
    );
  }

  try {
    const user = await getCurrentUser({ token });
    return { ...user, token };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    throw new Error(
      destructive(
        `Unable to verify authentication status. Run ${primary('designbase login')} to re-authenticate, or contact us at help@designbase.com if the problem persists.`
      )
    );
  }
};

export { getCredentialsOrThrow, readCredentialsFile, writeCredentialsFile };

import { Flags } from '@oclif/core';
import { BaseCommand } from '../utils/base-command.js';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { getVersion, listVersions } from '../utils/api.js';
import type {
  ClientSocketToServerEvents,
  PublishJobOutput,
  ServerSocketToClientEvents,
  VersionDto,
} from '../types/index.js';
import {
  findVersionByIdOrSemver,
  getVersionDescription,
  getVersionDisplayName,
} from '../utils/version-utils.js';
import { select } from '@inquirer/prompts';
import { isEmpty } from 'lodash-es';
import { destructive } from '../utils/colorize.js';
import { pager } from '../utils/pager.js';
import { isNotEmpty } from '../utils/collection-utils.js';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/config.js';

class Logs extends BaseCommand {
  static description = 'View publishing logs for a design system version';

  static flags = {
    stripColorCodes: Flags.boolean({
      char: 's',
      description: 'Strip color codes from the output',
    }),
    version: Flags.string({
      char: 'v',
      helpValue: '<versionIdOrSemanticVersion>',
      description:
        'Id or published version number to view logs for. For example: v0.0.43, 0.0.43, or 66461c33e633cbb0adf030ab',
    }),
  };

  async run(): Promise<void> {
    const { token } = await getCredentialsOrThrow();
    const { flags } = await this.parse(Logs);
    const { stripColorCodes } = flags;
    const versions = await listVersions({ token });

    let version: VersionDto | undefined = undefined;
    let versionIdOrSemver: string | undefined = flags.version;

    if (isEmpty(versionIdOrSemver)) {
      const choices = versions.map((version) => ({
        name: getVersionDisplayName(version),
        description: getVersionDescription(version),
        value: version._id,
      }));

      versionIdOrSemver = await select({
        message: 'Select a version to view logs for',
        choices,
      });
    }

    version = findVersionByIdOrSemver(versions, versionIdOrSemver);

    if (version === undefined) {
      this.error(destructive(`Version '${versionIdOrSemver}' not found.`));
    }

    version = await getVersion({
      id: version._id,
      includeOutput: true,
      sanitizeOutput: stripColorCodes,
      token,
    });

    const output = (version.publish_job_output ?? []).map((output) => output.value).join('\n');

    if (version.publish_status === 'published') {
      await pager(output);
      this.exit();
    }

    /**
     * @see https://socket.io/docs/v4/typescript/#types-for-the-client
     */
    const socket: Socket<ServerSocketToClientEvents, ClientSocketToServerEvents> = io(
      API_BASE_URL,
      {
        withCredentials: true,
        auth: { token },
        query: { versionId: version._id },
        transports: ['websocket'],
      }
    );

    if (isNotEmpty(version.publish_job_output)) {
      version.publish_job_output.forEach((output) => {
        if (output.type === 'stdout') {
          this.log(output.value);
        }

        if (output.type === 'stderr') {
          this.logToStderr(output.value);
        }
      });
    }

    if (isEmpty(version.publish_job_output)) {
      this.log(`${destructive('✗')} No logs found, listening for entries...`);
    }

    socket.on('version:update', (event) => {
      Object.entries(event.updatedFields ?? {}).forEach(([key, value]) => {
        if (key.startsWith('publish_job_output')) {
          const output = value as unknown as PublishJobOutput;
          if (output.type === 'stdout') {
            this.log(output.value);
          }

          if (output.type === 'stderr') {
            this.logToStderr(output.value);
          }
        }

        if (key === 'publish_status' && value === 'error') {
          this.exit(1);
        }

        if (key === 'publish_status' && value === 'published') {
          this.exit();
        }
      });
    });
  }
}

export { Logs };

import { Flags } from '@oclif/core';
import { BaseCommand } from '../utils/base-command.js';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { getVersion, listVersions } from '../utils/api.js';
import type { VersionDto } from '../types/index.js';
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

    const output = isNotEmpty(version.publish_job_stdout)
      ? version.publish_job_stdout.join('\n')
      : (version.publish_job_output ?? []).map((output) => output.value).join('\n');

    await pager(output);
  }
}

export { Logs };

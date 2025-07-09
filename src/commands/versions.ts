import { ux } from '@oclif/core';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { createVersion, listVersions } from '../utils/api.js';
import { BaseCommand } from '../utils/base-command.js';
import {
  getVersionDescription,
  getVersionDisplayName,
  isVersionPublishingOrPublished,
} from '../utils/version-utils.js';
import { constructive, primary } from '../utils/colorize.js';
import { select } from '@inquirer/prompts';
import type { SelectChoice } from '../types/select-choice.js';

const CREATE_VERSION = 'create-version' as const;
const EMPTY = 'empty' as const;
const SEED = 'seed' as const;

class Versions extends BaseCommand {
  static args = {};
  static description = 'List or create a new design system version';
  static examples = [];
  static flags = {};

  async run(): Promise<void> {
    const { token } = await getCredentialsOrThrow();

    let versionId: string | undefined = undefined;
    let versions = await listVersions({ token });

    const choices: Array<SelectChoice<string>> = versions
      .filter((version) => !isVersionPublishingOrPublished(version))
      .map((version) => ({
        name: getVersionDisplayName(version),
        description: getVersionDescription(version),
        value: version._id,
      }));

    choices.unshift({
      value: CREATE_VERSION,
      name: 'Create new version',
      description: 'Create a new version',
    });

    versionId = await select({
      message: 'Select a version to view more information about',
      choices,
    });

    if (versionId === CREATE_VERSION) {
      const choices: Array<SelectChoice<string>> = versions.map((version) => ({
        name: getVersionDisplayName(version),
        description: getVersionDescription(version),
        value: version._id,
      }));

      choices.unshift({
        value: SEED,
        name: 'Create a version from seed',
        description:
          'Creates a new version from the seed source files and icons. No tokens will be created.',
      });

      choices.unshift({
        value: EMPTY,
        name: 'Create an empty version',
        description:
          'Creates a new version without copying any source files, tokens or icons from a previous version.',
      });

      const baseVersionId = (versionId = await select({
        message: 'Select a base version to create a new version from',
        choices,
      }));

      ux.action.start('Creating version');
      const version = await createVersion({
        baseVersionId:
          baseVersionId === EMPTY || baseVersionId === SEED ? undefined : baseVersionId,
        empty: baseVersionId === EMPTY,
        token,
      });
      ux.action.stop(constructive('✔'));
      this.log(
        constructive(
          `Successfully created ${primary(getVersionDisplayName(version))} ${primary(`(${version._id})`)}`
        )
      );
      this.exit();
    }
  }
}

export { Versions };

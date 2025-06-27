import { Flags } from '@oclif/core';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { listVersions, pushSourceFiles } from '../utils/api.js';
import { BaseCommand } from '../utils/base-command.js';
import {
  getVersionDisplayName,
  isVersionId,
  isVersionPublishingOrPublished,
} from '../utils/version-utils.js';
import { destructive, primary } from '../utils/colorize.js';
import { isNotEmpty } from '../utils/collection-utils.js';
import { isEmpty } from 'lodash-es';
import { select } from '@inquirer/prompts';

class Push extends BaseCommand {
  static args = {};
  static description = 'Pull design system files from Designbase';
  static examples = [];
  static flags = {
    versionId: Flags.string({
      char: 'v',
      description:
        'Id to push files to. For example: 66461c33e633cbb0adf030ab. Published version numbers are not accepted because published versions cannot be modified.',
    }),
  };

  async run(): Promise<void> {
    const token = await getCredentialsOrThrow();
    const { flags } = await this.parse(Push);
    let versionId = flags.versionId;
    if (isNotEmpty(versionId) && !isVersionId(versionId)) {
      this.error(
        destructive(
          `versionId is invalid. Ids are 24 characters long, such as ${primary('66461c33e633cbb0adf030ab')}. The id of your version can be retrieved by running the ${primary('designbase pull')} command.`
        )
      );
    }

    const versions = await listVersions({ token });

    if (isEmpty(versionId)) {
      const choices = versions
        .filter((version) => !isVersionPublishingOrPublished(version))
        .map((version) => {
          return {
            name: getVersionDisplayName(version),
            description: `Id: ${version._id}${isNotEmpty(version.published_at) ? ` | Published on ${new Date(version.published_at).toLocaleString()}` : ' | Unpublished'}`,
            value: version._id,
          };
        });

      versionId = await select({
        message: 'Select a version to push design system files to',
        choices,
      });
    }

    const version = versions.find((version) => version._id === versionId);
    if (version === undefined) {
      this.error(destructive(`Version '${versionId}' not found.`));
    }

    if (isVersionPublishingOrPublished(version)) {
      const status = version.publish_status === 'published' ? 'published' : 'publishing';
      this.error(destructive(`Version '${version._id}' is ${status} and cannot be modified.`));
    }

    const result = await pushSourceFiles({
      versionId: version._id,
      token,
      sourceFiles: [{ path: 'turbo.json', content: JSON.stringify({}) }],
    });
  }
}

export { Push };

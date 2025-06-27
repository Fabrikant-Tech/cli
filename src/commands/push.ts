import { Flags } from '@oclif/core';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { listVersions, pushSourceFiles } from '../utils/api.js';
import { BaseCommand } from '../utils/base-command.js';
import { isVersionId } from '../utils/version-utils.js';
import { destructive, primary } from '../utils/colorize.js';

class Push extends BaseCommand {
  static args = {};
  static description = 'Pull design system files from Designbase';
  static examples = [];
  static flags = {
    versionId: Flags.string({
      char: 'v',
      description:
        'Id to push files to. For example: 66461c33e633cbb0adf030ab. Published version numbers are not accepted because published versions cannot be modified.',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const token = await getCredentialsOrThrow();
    const { flags } = await this.parse(Push);
    const { versionId } = flags;
    if (versionId === undefined || !isVersionId(versionId)) {
      this.error(
        destructive(
          `versionId is missing or invalid. Ids are 24 characters long, such as ${primary('66461c33e633cbb0adf030ab')}. The id of your version can be retrieved by running the ${primary('designbase pull')} command.`
        )
      );
    }

    const versions = await listVersions({ token });
    const version = versions.find((version) => version._id === versionId);
    if (version === undefined) {
      this.error(destructive(`Version '${versionId}' not found.`));
    }

    const result = await pushSourceFiles({
      versionId,
      token,
      sourceFiles: [{ path: 'turbo.json', content: JSON.stringify({}) }],
    });
  }
}

export { Push };

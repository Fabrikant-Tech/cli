import { Flags, ux } from '@oclif/core';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { getNormalizedSourceFilesByVersion, listVersions, pushSourceFiles } from '../utils/api.js';
import { BaseCommand } from '../utils/base-command.js';
import {
  getVersionDisplayName,
  isVersionId,
  isVersionPublishingOrPublished,
} from '../utils/version-utils.js';
import { constructive, destructive, neutral, primary, warning } from '../utils/colorize.js';
import { isNotEmpty } from '../utils/collection-utils.js';
import { isEmpty } from 'lodash-es';
import { select } from '@inquirer/prompts';
import { readFile } from 'node:fs/promises';
import { globby } from 'globby';
import path from 'node:path';
import { buildPushStatusTable } from '../utils/source-file-utils.js';
// @ts-expect-error
import pager from 'node-pager';

class Push extends BaseCommand {
  static args = {};
  static description = 'Pull design system files from Designbase';
  static examples = [];
  static flags = {
    acceptTokensJson: Flags.boolean({
      description: `Push changes to the ${primary('tokens.json')} file.`,
      default: false,
    }),
    acceptIconSvgs: Flags.boolean({
      description: `Push changes to SVG files in the ${primary('packages/core/assets/icon')} directory.`,
      default: false,
    }),
    deletePathsNotSpecified: Flags.boolean({
      description:
        'Delete existing paths on the Designbase server that are not present in the push.',
      default: false,
    }),
    directory: Flags.string({
      char: 'd',
      description: 'Directory to read source files from.',
      default: '.',
    }),
    exclude: Flags.string({
      char: 'e',
      description: `Glob pattern to exclude from pushing. For example, ${primary('designbase push --exclude "**/*.md"')} would recursively exclude any markdown files.`,
      multiple: true,
    }),
    versionId: Flags.string({
      char: 'v',
      description: `Id to push files to. For example: ${primary('66461c33e633cbb0adf030ab')}. Published version numbers are not accepted because published versions cannot be modified.`,
    }),
  };

  async run(): Promise<void> {
    const { token } = await getCredentialsOrThrow();
    const { flags } = await this.parse(Push);
    const { directory, deletePathsNotSpecified, acceptIconSvgs, acceptTokensJson } = flags;
    const additionalExcludes = (flags.exclude ?? []).map((pattern) => `!${pattern}`);
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

    const resolvedDirectory = path.resolve(directory);
    const filePaths = await globby(
      ['**/*', '!node_modules', '!dist', '!build', ...additionalExcludes],
      {
        cwd: resolvedDirectory,
      }
    );

    ux.action.start(`Retrieving files for ${getVersionDisplayName(version)}`);
    const sourceSourceFiles = await getNormalizedSourceFilesByVersion({
      versionId: version._id,
      token,
    });
    ux.action.stop(constructive('✔'));

    const targetSourceFiles = await Promise.all(
      filePaths.map(async (filePath) => {
        const resolvedFilePath = path.resolve(directory, filePath);
        const content = await readFile(resolvedFilePath, 'utf-8');
        return { path: filePath, content };
      })
    );
    const colorizedVersion = primary(getVersionDisplayName(version));

    const { table, added, removed, modified, unmodified, ignored } = buildPushStatusTable({
      sourceSourceFiles,
      targetSourceFiles,
      acceptIconSvgs,
      acceptTokensJson,
      deletePathsNotSpecified,
    });

    let answer: 'yes' | 'no' | 'status' | undefined = undefined;

    while (answer !== 'yes') {
      answer = await select({
        message: `Push ${Object.keys(targetSourceFiles).length} files (${constructive(`${added} added`)}, ${destructive(`${removed} removed`)}, ${warning(`${modified} modified`)}, ${unmodified} unmodified, ${neutral(`${ignored} ignored`)})`,

        choices: [
          { value: 'status', name: 'Show summary of file changes' },
          {
            value: 'yes',
            name: `Yes, push changes to ${colorizedVersion}`,
          },
          {
            value: 'no',
            name: `No, do not push any changes to ${colorizedVersion}`,
          },
        ],
      });

      if (answer === 'status') {
        await pager(table);
      }

      if (answer === 'no') {
        return;
      }

      if (answer === 'yes') {
        ux.action.start(`Pushing files to ${getVersionDisplayName(version)}`);
        await pushSourceFiles({
          acceptTokensJson,
          acceptIconSvgs,
          deletePathsNotSpecified,
          versionId: version._id,
          token,
          sourceFiles: targetSourceFiles,
        });
        ux.action.stop(constructive('✔'));
      }
    }
  }
}

export { Push };

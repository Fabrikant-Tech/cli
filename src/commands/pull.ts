import { Flags, ux } from '@oclif/core';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import {
  cleanSemver,
  getVersionDisplayName,
  isSemver,
  isVersionId,
} from '../utils/version-utils.js';
import { select } from '@inquirer/prompts';
import { getNormalizedSourceFilesByVersion, listVersions } from '../utils/api.js';
import { isNotEmpty } from '../utils/collection-utils.js';
import { isEmpty } from 'lodash-es';
import { constructive, destructive, primary } from '../utils/colorize.js';
import { BaseCommand } from '../utils/base-command.js';
import path from 'node:path';
import { cwd } from 'node:process';
import { buildPullStatusTable } from '../utils/source-file-utils.js';
// @ts-expect-error
import pager from 'node-pager';
import { mkdir, writeFile } from 'node:fs/promises';
import type { VersionDto } from '../types/index.js';

class Pull extends BaseCommand {
  static args = {};
  static description = 'Pull design system files from Designbase';
  static examples = [];
  static flags = {
    version: Flags.string({
      char: 'v',
      description:
        'Id or published version number to pull files from. For example: v0.0.43, 0.0.43, or 66461c33e633cbb0adf030ab',
    }),
    directory: Flags.string({
      char: 'd',
      description: 'Directory to write source files to.',
      default: '.',
    }),
    force: Flags.boolean({
      char: 'f',
      description: 'Write the source files without a confirmation prompt',
    }),
  };

  async run(): Promise<void> {
    const { token, organization: organizationId } = await getCredentialsOrThrow();
    const { flags } = await this.parse(Pull);
    const { force } = flags;
    const directory = path.resolve(cwd(), flags.directory);
    const versions = await listVersions({ token });

    let version: VersionDto | undefined = undefined;
    let semanticVersion =
      isNotEmpty(flags.version) && isSemver(flags.version) ? cleanSemver(flags.version) : undefined;
    let versionId =
      isNotEmpty(flags.version) && isVersionId(flags.version) ? flags.version : undefined;

    if (isEmpty(semanticVersion) && isEmpty(versionId)) {
      const choices = versions.map((version) => {
        return {
          name: getVersionDisplayName(version),
          description: `Id: ${version._id}${isNotEmpty(version.published_at) ? ` | Published on ${new Date(version.published_at).toLocaleString()}` : ' | Unpublished'}`,
          value: version._id,
        };
      });

      versionId = await select({
        message: 'Select a version to pull design system files from',
        choices,
      });
    }

    if (isNotEmpty(semanticVersion)) {
      version = versions.find((version) => version.publish_version === semanticVersion);
    }

    if (isNotEmpty(versionId)) {
      version = versions.find((version) => version._id === versionId);
    }

    if (version === undefined) {
      this.error(destructive(`Version '${semanticVersion ?? versionId}' not found.`));
    }

    ux.action.start(`Retrieving files for ${getVersionDisplayName(version)}`);
    const sourceFiles = await getNormalizedSourceFilesByVersion({ token, versionId: version._id });
    ux.action.stop(constructive('✔'));
    if (!Object.keys(sourceFiles).some((path) => path.endsWith('.tsx'))) {
      this.error(
        `No source files were found for '${getVersionDisplayName(version)}'. If you think this is an error, contact us at help@designbase.com for assistance.`
      );
    }

    const colorizedFileCount = primary(Object.keys(sourceFiles).length);
    const colorizedDirectory = primary(directory);

    if (force) {
      await writeSourceFiles(directory, sourceFiles);
      this.log(
        constructive(`Finished writing ${colorizedFileCount} files to ${colorizedDirectory}.`)
      );
      this.exit();
    }

    const table = await buildPullStatusTable(directory, sourceFiles);

    let answer: 'yes' | 'no' | 'status' | undefined = undefined;

    while (answer !== 'yes') {
      answer = await select({
        message: `${colorizedFileCount} files will be written to ${colorizedDirectory}.`,
        choices: [
          { value: 'status', name: 'Show summary of added or modified files' },
          {
            value: 'yes',
            name: `Yes, write ${colorizedFileCount} files to ${colorizedDirectory}`,
          },
          {
            value: 'no',
            name: `No, do not write any files to ${colorizedDirectory}`,
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
        await writeSourceFiles(directory, sourceFiles);
        this.log(
          constructive(`Finished writing ${colorizedFileCount} files to ${colorizedDirectory}.`)
        );
      }
    }
  }
}

const writeSourceFiles = async (
  directory: string,
  sourceFiles: Record<string, string>
): Promise<void> => {
  await mkdir(directory, { recursive: true });
  await Promise.all(
    Object.entries(sourceFiles).map(async ([_path, content]) => {
      const sourceFilePath = path.resolve(directory, _path);
      await mkdir(path.dirname(sourceFilePath), { recursive: true });
      await writeFile(sourceFilePath, content ?? '', 'utf-8');
    })
  );
};

export { Pull };

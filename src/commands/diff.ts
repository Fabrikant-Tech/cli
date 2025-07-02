import { Args, Flags, ux } from '@oclif/core';
import { BaseCommand } from '../utils/base-command.js';
import { getNormalizedSourceFilesByVersion, listVersions } from '../utils/api.js';
import { getCredentialsOrThrow } from '../utils/auth-utils.js';
import { constructive, destructive, primary } from '../utils/colorize.js';
import { isNotEmpty } from '../utils/collection-utils.js';
import { select } from '@inquirer/prompts';
import { findVersionByIdOrSemver, getVersionDisplayName } from '../utils/version-utils.js';
import { compact, isEmpty, isString } from 'lodash-es';
import type { VersionDto } from '../types/index.js';
import { globby } from 'globby';
import path from 'node:path';
import { cwd } from 'node:process';
import { readFile } from 'node:fs/promises';
import { filterNormalizedSourceFiles, normalizeSourceFiles } from '../utils/source-file-utils.js';
import type { StructuredPatch } from 'diff';
import { structuredPatch } from 'diff';
import { pager } from '../utils/pager.js';
import { Errors } from '@oclif/core';
import type { CommandError } from '@oclif/core/interfaces';

class Diff extends BaseCommand {
  static args = {
    paths: Args.string({
      name: 'paths',
      description: 'File path(s) or glob patterns to diff',
    }),
  };

  /**
   * `files` is a variable length argument so any number of files can be passed, so we need to disable `strict` mode.
   */
  static strict = false;

  static description = 'Diff file(s) between two versions';
  static examples = [];
  static flags = {
    from: Flags.string({
      char: 'f',
      description:
        'Id or published version number to diff files from. For example: v0.0.42, 0.0.42, or 66461c33e633cbb0adf030ab',
      exclusive: ['directory', 'version'],
      relationships: [{ type: 'all', flags: ['to'] }],
    }),
    to: Flags.string({
      char: 't',
      description:
        'Id or published version number to diff files against. For example: v0.0.43, 0.0.43, or 66461c33e633cbb0adf030ab',
      exclusive: ['directory', 'version'],
      relationships: [{ type: 'all', flags: ['from'] }],
    }),
    directory: Flags.string({
      char: 'd',
      description: 'Directory to read source files from.',
      default: '.',
      exclusive: ['from', 'to'],
    }),
    version: Flags.string({
      char: 'v',
      description:
        'Id or published version number to diff files. For example: v0.0.43, 0.0.43, or 66461c33e633cbb0adf030ab',
      exclusive: ['from', 'to'],
    }),
  };

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(Diff);
    const paths = isEmpty(argv) ? ['**/*'] : (argv as string[]);
    const directory = path.resolve(cwd(), flags.directory);
    const { token } = await getCredentialsOrThrow();
    const versions = await listVersions({ token });
    let versionIdOrSemver: string | undefined = flags.version;
    let version: VersionDto | undefined = undefined;

    if (isNotEmpty(flags.to) && isNotEmpty(flags.from)) {
      const fromVersion = findVersionByIdOrSemver(versions, flags.from);
      const toVersion = findVersionByIdOrSemver(versions, flags.to);
      if (fromVersion === undefined) {
        this.error(destructive(`Version '${flags.from}' not found.`));
      }

      if (toVersion === undefined) {
        this.error(destructive(`Version '${flags.to}' not found.`));
      }

      ux.action.start(
        `Retrieving files for ${getVersionDisplayName(fromVersion)} and ${getVersionDisplayName(toVersion)}`
      );
      const [_sourceSourceFiles, _targetSourceFiles] = await Promise.all([
        getNormalizedSourceFilesByVersion({
          token,
          versionId: fromVersion._id,
        }),
        getNormalizedSourceFilesByVersion({
          token,
          versionId: toVersion._id,
        }),
      ]);
      ux.action.stop(constructive('✔'));
      const sourceSourceFiles = filterNormalizedSourceFiles(_sourceSourceFiles, paths);
      const targetSourceFiles = filterNormalizedSourceFiles(_targetSourceFiles, paths);

      const patches = buildDiffPatches(sourceSourceFiles, targetSourceFiles);
      const formattedPatches = patches.map(formatPatch);

      await pager(formattedPatches.join('\n'));
      this.exit();
    }

    if (isEmpty(versionIdOrSemver)) {
      const choices = versions.map((version) => ({
        name: getVersionDisplayName(version),
        description: `Id: ${version._id}${isNotEmpty(version.published_at) ? ` | Published on ${new Date(version.published_at).toLocaleString()}` : ' | Unpublished'}`,
        value: version._id,
      }));

      versionIdOrSemver = await select({
        message: 'Select a version to diff design system files from',
        choices,
      });
    }

    version = findVersionByIdOrSemver(versions, versionIdOrSemver);

    if (version === undefined) {
      this.error(destructive(`Version '${versionIdOrSemver}' not found.`));
    }

    const filePaths = await globby([...paths, '!node_modules', '!dist', '!build'], {
      cwd: directory,
    });
    const sourceSourceFiles = normalizeSourceFiles(
      await Promise.all(
        filePaths.map(async (filePath) => {
          const resolvedFilePath = path.resolve(directory, filePath);
          const content = await readFile(resolvedFilePath, 'utf-8');
          return { path: filePath, content };
        })
      )
    );

    ux.action.start(`Retrieving files for ${getVersionDisplayName(version)}`);
    const targetSourceFiles = await getNormalizedSourceFilesByVersion({
      token,
      versionId: version._id,
    });
    ux.action.stop(constructive('✔'));

    const patches = buildDiffPatches(sourceSourceFiles, targetSourceFiles);
    const formattedPatches = patches.map(formatPatch);

    await pager(formattedPatches.join('\n'));
  }
}

const buildDiffPatches = (
  sourceSourceFiles: Record<string, string>,
  targetSourceFiles: Record<string, string>
) => {
  const patches = Object.entries(sourceSourceFiles).map(([path, content]) => {
    const targetContent = targetSourceFiles[path] ?? '';
    const patch = structuredPatch(path, path, content, targetContent);
    if (isEmpty(patch.hunks)) {
      return undefined;
    }

    return patch;
  });

  return compact(patches);
};

const formatPatch = (patch: StructuredPatch): string => {
  let lines: string[] = [];
  lines = [...lines, `---a/${patch.oldFileName}`, `+++b/${patch.newFileName}`];
  lines = lines.concat(
    patch.hunks.flatMap((hunk) => [
      /**
       * @see https://stackoverflow.com/a/6508925
       */
      primary(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`),
      ...hunk.lines.flatMap((line) => {
        if (line.startsWith('+')) {
          return constructive(line);
        }

        if (line.startsWith('-')) {
          return destructive(line);
        }

        return line;
      }),
    ])
  );

  return lines.join('\n');
};

export { Diff };

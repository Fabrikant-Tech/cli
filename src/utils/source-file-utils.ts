import { globby } from 'globby';
import type { SourceFileDto } from '../types/dtos/source-file-dto.js';
import type { Header } from 'tty-table';
import Table from 'tty-table';
import { sortBy, sumBy, uniq } from 'lodash-es';
import { constructive, destructive, neutral, warning } from './colorize.js';
import type { ChangeObject } from 'diff';
import { diffLines } from 'diff';
import { colorize } from '@oclif/core/ux';

const buildPullStatusTable = async (
  targetDirectory: string,
  sourceFiles: Record<string, string>
): Promise<string> => {
  const existingPaths: Record<string, string> = (
    await globby(['**/*', '!node_modules', '!dist', '!build'], {
      cwd: targetDirectory,
    })
  ).reduce((accumulated, filePath) => ({ ...accumulated, [filePath]: filePath }), {});

  const headers: Header[] = [
    { value: 'Path', align: 'left', headerAlign: 'center' },
    { value: 'Status', align: 'center' },
  ];

  const sortedSourceFilePaths = sortBy(Object.keys(sourceFiles));
  const table = Table(
    headers,
    sortedSourceFilePaths.map((sourceFilePath) => {
      const colorizer = sourceFilePath in existingPaths ? warning : constructive;
      const status = sourceFilePath in existingPaths ? 'M' : 'A';
      return [colorizer(sourceFilePath), colorizer(status)];
    })
  ).render();

  return table;
};

interface BuildPushStatusTableOptions {
  /**
   * Collection of existing source files for the version
   */
  sourceSourceFiles: Record<string, string>;

  /**
   * Collection of source files proposed for updating
   */
  targetSourceFiles: Array<Pick<SourceFileDto, 'content' | 'path'>>;

  /**
   * Whether the `tokens.json` file should be accepted & persisted as `Token` entities. Most of the time,
   * tokens will be managed in the UI by a designer, but this can be a useful escape-hatch for bulk-updating
   * tokens.
   * @default false
   */
  acceptTokensJson?: boolean;

  /**
   * Whether any file paths that do not exist in the input should be deleted.
   * @default false
   */
  deletePathsNotSpecified?: boolean;
}

const buildPushStatusTable = (options: BuildPushStatusTableOptions) => {
  const { sourceSourceFiles } = options;
  const headers: Header[] = [
    { value: 'Path', align: 'left', headerAlign: 'center' },
    { value: 'Diff', align: 'center' },
    { value: 'Status', align: 'center' },
  ];

  const targetSourceFiles = normalizeSourceFiles(options.targetSourceFiles);
  const sourcedSourceFilePaths = sortBy(Object.keys(sourceSourceFiles));
  const sortedTargetFilePaths = sortBy(Object.keys(targetSourceFiles));

  const filePathDiffs = sortBy(
    uniq([...sortedTargetFilePaths, ...sourcedSourceFilePaths]).map((filePath) => {
      const source = sourceSourceFiles[filePath] ?? '';
      const target = targetSourceFiles[filePath] ?? '';

      const diff = diffLines(source, target);
      return { path: filePath, diff };
    }),
    (sourceFile) => sourceFile.path
  );

  const table = Table(
    headers,
    filePathDiffs.map(({ path: filePath, diff }) => {
      let colorizer = (text: string) => text;
      let status = 'Unmodified';
      const formattedDiff = formatDiff(diff);
      if (!isUnmodified(diff) && filePath in sourceSourceFiles && filePath in targetSourceFiles) {
        colorizer = warning;
        status = 'Modified';
      }

      if (!isUnmodified(diff) && !(filePath in sourceSourceFiles)) {
        colorizer = constructive;
        status = 'Added';
      }

      if (
        !isUnmodified(diff) &&
        filePath in sourceSourceFiles &&
        !(filePath in targetSourceFiles)
      ) {
        colorizer = destructive;
        status = 'Removed';
      }

      return [colorizer(filePath), formattedDiff, colorizer(status)];
    })
  );

  return table.render();
};

const isUnmodified = (diff: Array<ChangeObject<string>>): boolean =>
  diff.every((changeObject) => !changeObject.added && !changeObject.removed);

const formatDiff = (diff: Array<ChangeObject<string>>) => {
  if (isUnmodified(diff)) {
    return '+-0';
  }

  const added = sumBy(
    diff.filter((changeObject) => changeObject.added),
    (changeObject) => changeObject.count
  );

  const removed = sumBy(
    diff.filter((changeObject) => changeObject.removed),
    (changeObject) => changeObject.count
  );

  return `${added > 0 ? constructive(`+${added}`) : ''}${removed > 0 ? destructive(`-${removed}`) : ''}`;
};

const normalizeSourceFiles = (
  sourceFiles: Array<Pick<SourceFileDto, 'path' | 'content'>>
): Record<string, string> =>
  sourceFiles.reduce(
    (accumulated, sourceFile) => ({ ...accumulated, [sourceFile.path]: sourceFile.content ?? '' }),
    {}
  );

export { buildPullStatusTable, buildPushStatusTable, normalizeSourceFiles };

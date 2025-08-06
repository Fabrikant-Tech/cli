import { globby } from 'globby';
import type { SourceFileDto } from '../types/dtos/source-file-dto.js';
import type { Header } from 'tty-table';
import Table from 'tty-table';
import { countBy, sortBy, sumBy, uniq } from 'lodash-es';
import { constructive, destructive, neutral, warning } from './colorize.js';
import type { ChangeObject } from 'diff';
import { diffLines } from 'diff';
import multimatch from 'multimatch';
import { isNotEmpty } from './collection-utils.js';

/**
 * These patterns match file paths that _cannot_ be edited by customers, and will be rejected if a user
 * attempts to push changes to these paths from the CLI.
 */
const NON_EDITABLE_FILE_PATH_PATTERNS = [
  'apps/docs/docusaurus-partial-config.json',
  'apps/docs/docusaurus.config.ts',
  'apps/docs/package.json',
  'apps/docs/sidebars.ts',
  'apps/docs/turbo.json',
  'meta.json',
  'package-lock.json',
  'package.json',
  'packages/**/*/package.json',
  'packages/**/*/turbo.json',
  'packages/scripts/build-tokens/**/*',
  'packages/scripts/constants/**/*',
  'packages/scripts/copy-docs/**/*',
  'packages/scripts/fix-stencil-json-docs/**/*',
  'packages/scripts/generate-asset-components/**/*',
  'packages/scripts/prebuild/**/*',
  'packages/scripts/types/**/*',
  'packages/scripts/utils/**/*',
  'turbo.json',
];

const DEFAULT_EXCLUDED_DIRECTORIES = [
  'node_modules',
  'dist',
  'build',
  'out',
  '.git',
  '.turbo',
  '.docusaurus',
  '.stencil',
];

const TOKENS_JSON_PATTERN = 'tokens.json';

const SVG_PATH_PATTERN = 'packages/core/assets/icon/*.svg';

const buildPullStatusTable = async (
  localSourceFiles: Record<string, string>,
  remoteSourceFiles: Record<string, string>
): Promise<string> => {
  const headers: Header[] = [
    { value: 'Path', align: 'left', headerAlign: 'center' },
    { value: 'Diff', align: 'center' },
    { value: 'Status', align: 'center' },
  ];

  const sourcedLocalFilePaths = sortBy(Object.keys(localSourceFiles));
  const sortedRemoteSourceFilePaths = sortBy(Object.keys(remoteSourceFiles));

  const filePathDiffs = sortBy(
    uniq([...sourcedLocalFilePaths, ...sortedRemoteSourceFilePaths]).map((filePath) => {
      const source = localSourceFiles[filePath] ?? '';
      const target = remoteSourceFiles[filePath] ?? '';
      const diff = diffLines(source, target);

      return { path: filePath, diff };
    }),
    (sourceFile) => sourceFile.path
  );

  const tableData = filePathDiffs.map(({ path: filePath, diff }) => {
    let colorizer = (text: string) => text;
    let status = 'Unmodified';
    const formattedDiff = formatDiff(diff);

    if (!isUnmodified(diff) && filePath in remoteSourceFiles && filePath in localSourceFiles) {
      colorizer = warning;
      status = 'Modified';
    }

    if (!isUnmodified(diff) && !(filePath in localSourceFiles)) {
      colorizer = constructive;
      status = 'Added';
    }

    return [colorizer(filePath), formattedDiff, colorizer(status)];
  });

  const table = Table(headers, tableData).render();

  return table;
};

interface BuildPushStatusTableOptions {
  /**
   * Collection of existing source files for the version
   */
  remoteSourceFiles: Record<string, string>;

  /**
   * Collection of source files proposed for updating
   */
  localSourceFiles: Array<Pick<SourceFileDto, 'content' | 'path'>>;

  /**
   * Whether the `tokens.json` file should be accepted & persisted as `Token` entities. Most of the time,
   * tokens will be managed in the UI by a designer, but this can be a useful escape-hatch for bulk-updating
   * tokens.
   * @default false
   */
  acceptTokensJson?: boolean;

  /**
   * Whether svg files in the `packages/core/assets/icon` directory should be accepted & persisted as `Icon` entities.
   * Most of the time, icons will be managed in the UI by a designer, but this can be a useful escape-hatch for bulk-updating
   * icons.
   */
  acceptIconSvgs?: boolean;

  /**
   * Whether any file paths that do not exist in the input should be deleted.
   * @default false
   */
  deletePathsNotSpecified?: boolean;
}

interface BuildPushStatusTableResult {
  table: string;
  added: number;
  removed: number;
  ignored: number;
  modified: number;
  unmodified: number;
}

const buildPushStatusTable = (options: BuildPushStatusTableOptions): BuildPushStatusTableResult => {
  const { remoteSourceFiles, acceptIconSvgs, acceptTokensJson, deletePathsNotSpecified } = options;
  const headers: Header[] = [
    { value: 'Path', align: 'left', headerAlign: 'center' },
    { value: 'Diff', align: 'center' },
    { value: 'Status', align: 'center' },
  ];

  const localSourceFiles = normalizeSourceFiles(options.localSourceFiles);
  const sortedRemoteSourceFilePaths = sortBy(Object.keys(remoteSourceFiles));
  const sortedLocalFilePaths = sortBy(Object.keys(localSourceFiles));

  const filePathDiffs = sortBy(
    uniq([...sortedLocalFilePaths, ...sortedRemoteSourceFilePaths]).map((filePath) => {
      const source = remoteSourceFiles[filePath] ?? '';
      const target = localSourceFiles[filePath] ?? '';

      const diff = diffLines(source, target);
      return { path: filePath, diff };
    }),
    (sourceFile) => sourceFile.path
  );

  const tableData = filePathDiffs.map(({ path: filePath, diff }) => {
    let colorizer = (text: string) => text;
    let status = 'Unmodified';
    const formattedDiff = formatDiff(diff);

    if (!isUnmodified(diff) && filePath in remoteSourceFiles && filePath in localSourceFiles) {
      colorizer = warning;
      status = 'Modified';
    }

    if (!isUnmodified(diff) && !(filePath in remoteSourceFiles)) {
      colorizer = constructive;
      status = 'Added';
    }

    if (!isUnmodified(diff) && filePath in remoteSourceFiles && !(filePath in localSourceFiles)) {
      if (deletePathsNotSpecified !== true) {
        colorizer = neutral;
        status = 'Ignored because --deletePathsNotSpecified was not provided';
      }

      if (deletePathsNotSpecified === true) {
        colorizer = destructive;
        status = 'Removed';
      }
    }

    if (isNotEmpty(multimatch(filePath, SVG_PATH_PATTERN)) && acceptIconSvgs !== true) {
      colorizer = neutral;
      status = `Ignored because --acceptIconSvgs was not provided`;
    }

    if (filePath === TOKENS_JSON_PATTERN && acceptTokensJson !== true) {
      colorizer = neutral;
      status = `Ignored because --acceptTokensJson was not provided`;
    }

    if (isNotEmpty(multimatch(filePath, NON_EDITABLE_FILE_PATH_PATTERNS))) {
      colorizer = neutral;
      status = `Ignored because file path is not editable`;
    }

    return [colorizer(filePath), formattedDiff, colorizer(status)];
  });

  const table = Table(headers, tableData).render();

  const count = countBy(tableData, ([_filePath, _diff, status]) => {
    if (status.includes('Added')) {
      return 'added';
    }

    if (status.includes('Removed')) {
      return 'removed';
    }

    if (status.includes('Modified')) {
      return 'modified';
    }

    if (status.includes('Unmodified')) {
      return 'unmodified';
    }

    if (status.includes('Ignored')) {
      return 'ignored';
    }
  });

  const { added = 0, removed = 0, ignored = 0, modified = 0, unmodified = 0 } = count;

  return {
    table,
    added,
    removed,
    ignored,
    modified,
    unmodified,
  };
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

const filterNormalizedSourceFiles = (
  sourceFiles: Record<string, string>,
  patterns: string[]
): Record<string, string> => {
  const paths = Object.keys(sourceFiles);
  const filteredPaths = multimatch(paths, patterns);
  const filteredSourceFiles = Object.fromEntries(
    filteredPaths.map((path) => [path, sourceFiles[path]])
  );

  return filteredSourceFiles;
};

interface ReadFilePathsOptions {
  directory: string;
  additionalExcludes?: string[];
}

const readFilePaths = async (options: ReadFilePathsOptions): Promise<string[]> => {
  const { additionalExcludes = [], directory } = options;
  const filePaths = await globby(
    [
      '**/*',
      `!{${DEFAULT_EXCLUDED_DIRECTORIES.join(',')}}`,
      `!**/*/{${DEFAULT_EXCLUDED_DIRECTORIES.join(',')}}`,
      ...additionalExcludes,
    ],
    {
      cwd: directory,
      dot: true,
    }
  );

  return filePaths;
};

export {
  buildPullStatusTable,
  buildPushStatusTable,
  filterNormalizedSourceFiles,
  normalizeSourceFiles,
  readFilePaths,
};

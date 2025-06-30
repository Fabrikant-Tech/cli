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

const TOKENS_JSON_PATTERN = 'tokens.json';

const SVG_PATH_PATTERN = 'packages/core/assets/icon/*.svg';

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
  const { sourceSourceFiles, acceptIconSvgs, acceptTokensJson, deletePathsNotSpecified } = options;
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

  const tableData = filePathDiffs.map(({ path: filePath, diff }) => {
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

    if (!isUnmodified(diff) && filePath in sourceSourceFiles && !(filePath in targetSourceFiles)) {
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

export { buildPullStatusTable, buildPushStatusTable, normalizeSourceFiles };

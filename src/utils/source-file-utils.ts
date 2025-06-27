import { readdir } from 'node:fs/promises';
import { globby } from 'globby';
import type { SourceFileDto } from '../types/dtos/source-file-dto.js';
import type { Header } from 'tty-table';
import Table from 'tty-table';
import { sortBy } from 'lodash-es';
import { constructive, warning } from './colorize.js';
import path from 'node:path';

const buildPullStatusTable = async (
  targetDirectory: string,
  sourceFiles: SourceFileDto[]
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

  const sortedSourceFilePaths = sortBy(sourceFiles.map((sourceFile) => sourceFile.path));
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

export { buildPullStatusTable };

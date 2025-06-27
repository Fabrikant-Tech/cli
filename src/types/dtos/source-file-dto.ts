import type { CreatableDto, DeletableDto, EntityDto, LockableDto, UpdatableDto } from './index.js';

interface SourceFileDto extends EntityDto, CreatableDto, UpdatableDto, DeletableDto, LockableDto {
  content?: string;
  path: string;
  version: string;
}

export type { SourceFileDto };

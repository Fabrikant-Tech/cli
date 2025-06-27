import { valid, clean } from 'semver';
import type { VersionDto } from './api.js';
import { isNotEmpty } from './collection-utils.js';

/**
 * Cleans the semantic version. Assumes the input has already been validated with `isSemver`.
 */
const cleanSemver = (version: string): string => clean(version) as string;

/**
 * Checks to see whether the input is a valid semantic version specifier.
 */
const isSemver = (version: string): boolean => valid(version) !== null;

const isVersionId = (version: string) => !isSemver(version) && version.length === 24;

const getVersionDisplayName = (version: VersionDto): string =>
  isNotEmpty(version.publish_version) ? version.publish_version : `Draft ${version.number}`;

const isVersionPublishingOrPublished = (version: VersionDto) =>
  isNotEmpty(version.published_at) ||
  version.publish_status === 'in_progress' ||
  version.publish_status === 'queued' ||
  version.publish_status === 'published';

export {
  cleanSemver,
  getVersionDisplayName,
  isSemver,
  isVersionId,
  isVersionPublishingOrPublished,
};

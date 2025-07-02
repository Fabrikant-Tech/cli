import { valid, clean } from 'semver';
import { isNotEmpty } from './collection-utils.js';
import type { VersionDto } from '../types/index.js';

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

const getVersionDescription = (version: VersionDto): string =>
  `Id: ${version._id}${isNotEmpty(version.published_at) ? ` | Published on ${new Date(version.published_at).toLocaleString()}` : ' | Unpublished'}`;

const isVersionPublishingOrPublished = (version: VersionDto) =>
  isNotEmpty(version.published_at) ||
  version.publish_status === 'in_progress' ||
  version.publish_status === 'queued' ||
  version.publish_status === 'published';

const findVersionByIdOrSemver = (
  versions: VersionDto[],
  idOrSemanticVersion: string | undefined
): VersionDto | undefined => {
  if (idOrSemanticVersion === undefined) {
    return undefined;
  }

  if (isVersionId(idOrSemanticVersion)) {
    const id = idOrSemanticVersion;
    return versions.find((version) => version._id === id);
  }

  if (isSemver(idOrSemanticVersion)) {
    const semanticVersion = cleanSemver(idOrSemanticVersion);
    return versions.find((version) => version.publish_version === semanticVersion);
  }
};

export {
  cleanSemver,
  findVersionByIdOrSemver,
  getVersionDescription,
  getVersionDisplayName,
  isSemver,
  isVersionId,
  isVersionPublishingOrPublished,
};

import type { RequestInit, Response } from 'node-fetch';
import fetch from 'node-fetch';
import { ApiError } from './errors.js';
import { URLSearchParams } from 'url';
import { isNotEmpty } from './collection-utils.js';
import type { SourceFileDto, UserDto, VersionDto } from '../types/dtos/index.js';
import type { SerializableObject } from '../types/serializable-object.js';

interface LoginOptions {
  email: string;
  password: string;
}

interface AuthenticatedRequestOptions {
  token: string;
}

const JSON_CONTENT_TYPE_HEADER = { 'Content-Type': 'application/json' };

const API_BASE_URL = 'http://localhost:8080';

const login = async (options: LoginOptions): Promise<UserDto> => {
  const { email, password } = options;
  const response = await post('/users/login', { body: { email, password } });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(
      error,
      'Unable to login with the provided credentials. Please confirm you are using the right email and password, or contact us at help@designbase.com if the problem persists.'
    );
  }

  const user = (await response.json()) as UserDto;
  return user;
};

type GetCurrentUserOptions = AuthenticatedRequestOptions;

const getCurrentUser = async (options: GetCurrentUserOptions) => {
  const { token } = options;
  const response = await get('/users/me', { headers: getAuthorizationHeader(token) });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(error, 'Token is expired or invalid.');
  }

  const user = (await response.json()) as UserDto;
  return user;
};

type ListVersionsOptions = AuthenticatedRequestOptions;

const listVersions = async (options: ListVersionsOptions): Promise<VersionDto[]> => {
  const { token } = options;
  const response = await get(`/system/versions`, {
    headers: getAuthorizationHeader(token),
    query: {
      includeEditorFields: false.toString(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(error);
  }

  const versions = (await response.json()) as VersionDto[];
  return versions;
};

type ListSourceFilesOptions = AuthenticatedRequestOptions & {
  versionId: string;
};

const listSourceFiles = async (options: ListSourceFilesOptions): Promise<SourceFileDto[]> => {
  const { token, versionId } = options;
  const response = await get('/source-files', {
    headers: getAuthorizationHeader(token),
    query: {
      versionId,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(error);
  }

  const sourceFiles = (await response.json()) as SourceFileDto[];
  return sourceFiles;
};

type GetTokensAsJsonOptions = AuthenticatedRequestOptions & {
  versionId: string;
};

const getTokensAsJson = async (options: GetTokensAsJsonOptions): Promise<SerializableObject> => {
  const { versionId, token } = options;
  const response = await get('/tokens/json', {
    headers: getAuthorizationHeader(token),
    query: {
      versionId,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(error);
  }

  const tokens = (await response.json()) as SerializableObject;
  return tokens;
};

type PushSourceFilesOptions = AuthenticatedRequestOptions & {
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

  /**
   * Collection of source files being pushed
   */
  sourceFiles: Array<Pick<SourceFileDto, 'content' | 'path'>>;

  /**
   * Id of the version to upsert source files for.
   */
  versionId: string;
};

const pushSourceFiles = async (options: PushSourceFilesOptions) => {
  const { token, versionId, sourceFiles } = options;
  const body = new FormData();
  body.append('versionId', versionId);
  const sourceFilesFile = new File([JSON.stringify(sourceFiles)], 'source-files.json');
  body.append('sourceFiles', sourceFilesFile);
  const response = await post('/source-files/push', {
    headers: getAuthorizationHeader(token),
    body,
  });

  if (!response.ok) {
    const error = await response.json();
    throw ApiError.fromResponseJson(error);
  }

  const result = await response.json();
  return result;
};

interface PostOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body: Record<string, unknown> | FormData;
  query?: Record<string, string>;
}

const post = async (path: string, options: PostOptions): Promise<Response> => {
  const { query } = options;
  const url = getApiUrl(path, query);
  let headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers = { ...JSON_CONTENT_TYPE_HEADER };
  }

  const body = options.body instanceof FormData ? options.body : JSON.stringify(options.body);
  return fetch(url, {
    method: 'POST',
    headers,
    body,
  });
};

interface GetOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

const get = async (path: string, options: GetOptions): Promise<Response> => {
  const { headers, query } = options;
  const url = getApiUrl(path, query);
  return fetch(url, {
    method: 'GET',
    headers: { ...JSON_CONTENT_TYPE_HEADER, ...headers },
  });
};

const getApiUrl = (path: string, query?: Record<string, string>): string => {
  const _path = path.startsWith('/') ? path : `/${path}`;
  const queryString = new URLSearchParams(query).toString();
  return `${API_BASE_URL}${_path}${isNotEmpty(queryString) ? `?${queryString}` : ''}`;
};

const getAuthorizationHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export type { UserDto, VersionDto };
export { getCurrentUser, getTokensAsJson, listSourceFiles, listVersions, login, pushSourceFiles };

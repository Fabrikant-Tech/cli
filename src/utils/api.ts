import type { RequestInit, Response } from 'node-fetch';
import fetch from 'node-fetch';
import { ApiError } from './errors.js';
import { URLSearchParams } from 'url';
import { isNotEmpty } from './collection-utils.js';
import type { SourceFileDto, UserDto, VersionDto } from '../types/dtos/index.js';

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
  const response = await get('/users/me', { headers: getBearerTokenHeader(token) });

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
    headers: getBearerTokenHeader(token),
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
    headers: getBearerTokenHeader(token),
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

interface PostOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body: Record<string, unknown>;
  query?: Record<string, string>;
}

const post = async (path: string, options: PostOptions): Promise<Response> => {
  const { headers, body, query } = options;
  const url = getApiUrl(path, query);
  return fetch(url, {
    method: 'POST',
    headers: { ...JSON_CONTENT_TYPE_HEADER, ...headers },
    body: JSON.stringify(body),
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

const getBearerTokenHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export type { UserDto, VersionDto };
export { getCurrentUser, listSourceFiles, listVersions, login };

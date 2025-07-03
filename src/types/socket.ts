import type { ChangeStreamEvent, VersionDto } from './index.js';

interface ServerSocketToClientEvents {
  ['version:update']: (event: ChangeStreamEvent<VersionDto> & { id: string }) => void;
}

interface ClientSocketToServerEvents {}

export type { ClientSocketToServerEvents, ServerSocketToClientEvents };

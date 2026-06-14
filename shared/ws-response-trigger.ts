import { WsClientRequest, isWsClientRequest } from './ws-client-request.js';

// Used when players in a match connect or disconnect. playerId identifies whose
// connection changed - not necessarily the recipient's (this is broadcast to every
// connected player in the match).
export interface WsClientConnection {
  readonly clientConnection: true;
  readonly playerId: string;
}

export function wsClientConnection(playerId: string): WsClientConnection {
  return { clientConnection: true, playerId };
}

interface WsBadClientRequest { readonly badClientRequest: true }
interface WsUnknownProblem { readonly unknownProblem: true }

export type WsResponseTrigger =
  | WsClientRequest
  | WsBadClientRequest
  | WsClientConnection
  | WsUnknownProblem;

export function isWsClientConnection(obj: unknown): obj is WsClientConnection {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsClientConnection;
  return candidate.clientConnection === true && typeof candidate.playerId === 'string';
}

function isWsBadClientRequest(obj: unknown): obj is WsBadClientRequest {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsBadClientRequest;
  return candidate.badClientRequest === true;
}

function isWsUnknownProblem(obj: unknown): obj is WsUnknownProblem {
  if (typeof obj !== 'object' || obj === null) return false;
  const candidate = obj as WsUnknownProblem;
  return candidate.unknownProblem === true;
}

export function isWsResponseTrigger(obj: unknown): obj is WsResponseTrigger {
  return (
    isWsClientRequest(obj) ||
    isWsClientConnection(obj) ||
    isWsBadClientRequest(obj) ||
    isWsUnknownProblem(obj)
  );
}

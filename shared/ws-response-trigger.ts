import { WsClientRequest, isWsClientRequest } from './ws-client-request.js';

// Used when players in a match connect or disconnect.
export const wsClientConnection = { clientConnection: true } as const;

interface WsBadClientRequest { readonly badClientRequest: true }
interface WsUnknownProblem { readonly unknownProblem: true }

export type WsResponseTrigger =
  | WsClientRequest
  | WsBadClientRequest
  | typeof wsClientConnection
  | WsUnknownProblem;

export function isWsClientConnection(obj: unknown): obj is typeof wsClientConnection {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as typeof wsClientConnection;
  return candidate.clientConnection === true;
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

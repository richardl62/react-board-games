// Actions for test/debug purposes.  These are sent over the websocket in the
// same way as actions, i.e. moves and events, but they don't trigger a
// direct response. (They can trigger an indirect response, e.g. reports of a
// closed connection).
export interface WsCloseConnection {
  closeConnection: true;
  reconnection:
    | { blockedMs: number } // milliseconds to block reconnection attempts for
    | 'prevent'; // tell the client not to attempt reconnection.
}
export interface WsResponseDelay {
  responseDelay: number; // milliseconds
}

export type WsTestAction = WsCloseConnection | WsResponseDelay;

export function isWsCloseConnection(obj: unknown): obj is WsCloseConnection {
  if (typeof obj !== 'object' || obj === null) return false;
  const candidate = obj as WsCloseConnection;
  return candidate.closeConnection === true && candidate.reconnection !== undefined;
}

export function isWsResponseDelay(obj: unknown): obj is WsResponseDelay {
  if (typeof obj !== 'object' || obj === null) return false;
  const candidate = obj as WsResponseDelay;
  return typeof candidate.responseDelay === 'number';
}

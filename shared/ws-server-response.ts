import { MatchState, isMatchState } from './match-state.js';
import { WsResponseTrigger, isWsResponseTrigger } from './ws-response-trigger.js';

export interface WsServerResponse {
  trigger: WsResponseTrigger;
  matchState: MatchState;
  // Present (and true) when an out-of-sequence move changed gameData for a player
  // other than the one who made the move. Clients should discard any optimistic
  // prediction chain and fall back to the server's authoritative state.
  changesOtherPlayersData?: true;
}

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsServerResponse;

  return isWsResponseTrigger(candidate.trigger) && isMatchState(candidate.matchState);
}

import { MatchState, isMatchState } from './match-state.js';
import { WsResponseTrigger, isWsResponseTrigger } from './ws-response-trigger.js';

export interface WsServerResponse {
  trigger: WsResponseTrigger;

  matchState: MatchState;
}

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsServerResponse;

  return isWsResponseTrigger(candidate.trigger) && isMatchState(candidate.matchState);
}

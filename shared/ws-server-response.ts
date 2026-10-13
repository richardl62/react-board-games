import { MatchOptions, isMatchOptions } from './match-options.js';
import { MatchState, isMatchState } from './match-state.js';
import { WsResponseTrigger, isWsResponseTrigger } from './ws-response-trigger.js';

export interface WsServerResponse {
  trigger: WsResponseTrigger;
  matchState: MatchState;

  // Sent with every response for simplicity, although fixed for the match.
  matchOptions: MatchOptions;
}

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsServerResponse;

  return (
    isWsResponseTrigger(candidate.trigger) &&
    isMatchState(candidate.matchState) &&
    isMatchOptions(candidate.matchOptions)
  );
}

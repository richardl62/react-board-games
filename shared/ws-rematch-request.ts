// Sent by a player to propose, accept or decline a rematch (i.e. a restart of the
// current match). A rematch happens once all players have proposed or accepted it.
// A decline (by any player, including the proposer) cancels the proposal.
//
// These are sent over the websocket, but separately from the normal client requests
// (moves and events) so that they are not subject to optimistic updates.
export type WsRematchRequest =
  | { rematch: 'propose'; randomSeed: number }
  | { rematch: 'accept' }
  | { rematch: 'decline' };

export function isWsRematchRequest(obj: unknown): obj is WsRematchRequest {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as WsRematchRequest;
  switch (candidate.rematch) {
    case 'propose':
      return typeof candidate.randomSeed === 'number';
    case 'accept':
    case 'decline':
      return true;
    default:
      return false;
  }
}

import { PublicPlayerMetadata } from '@shared/lobby/types';
import { WsRematchRequest } from '@shared/ws-rematch-request';
import { sAssert } from '@shared/utils/assert';

export interface OfflineRematchState {
  playerData: PublicPlayerMetadata[];

  // The random seed supplied by the proposer of a rematch. Null if there is no
  // rematch proposal.
  rematchSeed: number | null;
}

// The offline equivalent of the server's Match.handleRematchRequest (which should be
// kept in step with this). Returns the updated state, and whether the match should now
// be restarted (using rematchSeed). The input state is not modified.
export function applyRematchRequest(
  { playerData, rematchSeed }: OfflineRematchState,
  playerID: string,
  request: WsRematchRequest,
): OfflineRematchState & { restart: boolean } {
  sAssert(
    playerData.some((p) => p.id === playerID),
    `Player ${playerID} not found in player data`,
  );
  sAssert(
    playerData.every((p) => p.name !== null),
    'Offline players are expected to have joined from the start',
  );

  const markWanting = () =>
    playerData.map((p) => (p.id === playerID ? { ...p, wantsRematch: true as const } : p));

  let newState: OfflineRematchState;
  switch (request.rematch) {
    case 'propose':
      // If a rematch has already been proposed, treat this as an acceptance.
      newState = { playerData: markWanting(), rematchSeed: rematchSeed ?? request.randomSeed };
      break;

    case 'accept':
      // Ignore an acceptance if the proposal has since been declined.
      newState =
        rematchSeed === null
          ? { playerData, rematchSeed }
          : { playerData: markWanting(), rematchSeed };
      break;

    case 'decline':
      newState = {
        playerData: playerData.map(({ wantsRematch: _, ...rest }) => rest),
        rematchSeed: null,
      };
      break;
  }

  const restart = newState.rematchSeed !== null && newState.playerData.every((p) => p.wantsRematch);
  return { ...newState, restart };
}

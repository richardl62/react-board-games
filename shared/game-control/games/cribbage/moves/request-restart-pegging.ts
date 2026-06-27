import { processGameRequest } from './process-game-request.js';
import { GameRequest, PlayerData, ServerData } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const requestRestartPegging = outOfSequenceMove(function requestRestartPegging(
  { G, ctx, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  if (processGameRequest(GameRequest.RestartPegging, ctx, viewingPlayer, getPlayerData, setPlayerData)) {
    G.shared.hand = [];
  }
});

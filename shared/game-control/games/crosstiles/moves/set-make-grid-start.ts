import { GameStage, PlayerData, ServerData } from '../server-data.js';
import { MoveArg0 } from '../../../move-fn.js';

export function setMakeGridStartTime(
  { G, viewingPlayer: playerID, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  startTime: number,
): void {
  if (G.stage !== GameStage.makingGrids) {
    throw new Error(`Unexpected call to setMakeGridStateTime when stage is ${G.stage}`);
  }

  const playerData = getPlayerData(playerID);
  if (playerData.makeGridStartTime !== null && playerData.makeGridStartTime !== startTime) {
    throw new Error(
      `Unexpected value for makeGridStartTime: ` +
        `Current ${playerData.makeGridStartTime} new ${startTime}`,
    );
  }

  setPlayerData(playerID, { ...playerData, makeGridStartTime: startTime });
}

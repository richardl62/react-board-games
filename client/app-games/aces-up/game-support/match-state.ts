import { useStandardBoardContext } from '../../../app-game-support/standard-board';
import { BoardProps } from '../../../app-game-support/board-props';
import { PlayerData, ServerData } from '@game-control/games/aces-up/server-data';
import { ClientMoves } from '@game-control/games/aces-up/moves/moves';
import { PlayerID } from '@game-control/playerid';
import { sAssert } from '@utils/assert';

export interface MatchState extends BoardProps<ServerData, ClientMoves> {
  getPlayerData: (owner: PlayerID) => PlayerData;
}

export function useMatchState(): MatchState {
  const ctx = useStandardBoardContext() as BoardProps<ServerData, ClientMoves>;

  const getPlayerData = (owner: PlayerID): PlayerData => {
    const meta = ctx.matchStatus.playerData.find((p) => p.id === owner);
    sAssert(meta?.gameData != null, `Player data not found for player ${owner}`);
    return meta.gameData as PlayerData;
  };

  return {
    ...ctx,
    getPlayerData,
  };
}

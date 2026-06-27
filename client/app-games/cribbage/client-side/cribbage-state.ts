import { useStandardBoardContext } from '@/app-game-support/standard-board';
import { BoardProps } from '@/app-game-support/board-props';
import { ClientMoves } from '@game-control/games/cribbage/moves/moves';
import { CardSetID, PlayerData, PlayerID, ServerData } from '@game-control/games/cribbage/server-data';
import { sAssert } from '@utils/assert';

export interface CribbageState extends ServerData {
  // Per-player data reconstructed from matchStatus.playerData for convenience
  player0: PlayerData;
  player1: PlayerData;

  moves: ClientMoves;
  numPlayers: number;

  me: PlayerID;
  pone: PlayerID;

  poneName: string;
}

export function useCribbageState(): CribbageState {
  const gameProps = useStandardBoardContext() as BoardProps<ServerData, ClientMoves>;

  let me: PlayerID;
  let pone: PlayerID;
  let poneID: '0' | '1';

  sAssert(gameProps.viewingPlayer === '0' || gameProps.viewingPlayer === '1');

  if (gameProps.viewingPlayer === '0') {
    me = CardSetID.Player0;
    pone = CardSetID.Player1;
    poneID = '1';
  } else {
    me = CardSetID.Player1;
    pone = CardSetID.Player0;
    poneID = '0';
  }

  const poneName = gameProps.getPlayerName(poneID);

  const getPlayerGameData = (pid: string): PlayerData => {
    const meta = gameProps.matchStatus.playerData.find((p) => p.id === pid);
    sAssert(meta?.gameData != null, `Player data not found for player ${pid}`);
    return meta.gameData as PlayerData;
  };

  return {
    ...gameProps.G,
    player0: getPlayerGameData('0'),
    player1: getPlayerGameData('1'),
    moves: gameProps.moves,
    numPlayers: gameProps.ctx.numPlayers,
    me,
    pone,
    poneName,
  };
}

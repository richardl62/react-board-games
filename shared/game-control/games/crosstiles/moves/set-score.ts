import { ScoreCategory } from '../score-categories.js';
import { PlayerData, ServerData, GameStage } from '../server-data.js';
import { MoveArg0 } from '../../../move-fn.js';
import { PlayerID } from '../../../playerid.js';

export interface ScoreWithCategory {
  category: ScoreCategory;
  score: number;
  bonus: number;
}

type Arg0 = Pick<MoveArg0<ServerData, PlayerData>, 'getPlayerData' | 'setPlayerData'>;

export function doSetScore(arg0: Arg0, playerID: PlayerID, arg: ScoreWithCategory): void {
  const { getPlayerData, setPlayerData } = arg0;
  const { category, score, bonus } = arg;

  const playerData = getPlayerData(playerID);
  const scoreCard = { ...playerData.scoreCard };
  scoreCard[category] = score;
  if (bonus) {
    scoreCard.bonus = (scoreCard.bonus ?? 0) + bonus;
  }

  setPlayerData(playerID, { ...playerData, scoreCard, chosenCategory: category });
}

export function setScore(
  { G, viewingPlayer: playerID, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  arg: ScoreWithCategory,
): void {
  if (G.stage !== GameStage.scoring) {
    throw new Error('Unexpected call to recordGrid');
  }

  doSetScore({ getPlayerData, setPlayerData }, playerID, arg);
}

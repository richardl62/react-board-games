import { scoreCardFull } from './score-card.js';
import { selectLetters } from './select-letters.js';
import { GameStage, PlayerData, ServerData, startingPlayerData } from '../server-data.js';
import { sAssert } from '../../../../utils/assert.js';
import { MoveArg0 } from '../../../move-fn.js';

export function startRound({
  G,
  ctx,
  random,
  getPlayerData,
  setPlayerData,
}: MoveArg0<ServerData, PlayerData>): void {
  const { stage, options } = G;

  sAssert(stage === GameStage.makingGrids);

  for (const pid of ctx.playOrder) {
    const { scoreCard } = getPlayerData(pid);
    setPlayerData(pid, { ...startingPlayerData(), scoreCard });
  }

  const gameOver = ctx.playOrder.every((pid) => scoreCardFull(getPlayerData(pid).scoreCard));

  if (gameOver) {
    G.stage = GameStage.over;
  } else {
    G.round = G.round + 1;

    if (G.options.playersGetSameLetters) {
      const sharedLetters = selectLetters(options, random);
      for (const pid of ctx.playOrder) {
        setPlayerData(pid, { ...getPlayerData(pid), selectedLetters: sharedLetters });
      }
    } else {
      for (const pid of ctx.playOrder) {
        setPlayerData(pid, {
          ...getPlayerData(pid),
          selectedLetters: selectLetters(options, random),
        });
      }
    }
  }
}

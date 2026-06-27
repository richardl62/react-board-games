import { PegPositions, PlayerID, PlayerData, ServerData, cardSetIDToPlayerID } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

interface Arg {
  who: PlayerID;
  score: number;
}

function movePeg(pegs: PegPositions, moveTo: number): PegPositions {
  const { score, trailingPeg } = pegs;
  // You can't move onto an existing peg.
  if (moveTo === score || moveTo === trailingPeg) {
    return pegs;
  }

  if (moveTo > score) {
    // Standard move
    return { score: moveTo, trailingPeg: score };
  } else if (moveTo > trailingPeg) {
    // A backwards move ahead of the trailing peg.
    return { score: moveTo, trailingPeg };
  } else {
    // A backwards move behind the trailing peg.
    return { score: trailingPeg, trailingPeg: moveTo };
  }
}

export const pegClick = outOfSequenceMove(function pegClick(
  { getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  { who, score }: Arg,
): void {
  const pid = cardSetIDToPlayerID(who);
  const pd = getPlayerData(pid);
  const updatedPegs = movePeg(pd, score);
  setPlayerData(pid, { ...pd, ...updatedPegs });
});

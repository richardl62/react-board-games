// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps as BgioBoardProps } from "./bgio-types";
import { PlayerData, makePlayerData } from "./player-data";


// 'G extends any = any' is copied from BoardProps. I don't see why it is better than 'any'.
/**
 * This BoardProps is an extending of BgioBoardProps Bgio BoardProps.
 */
export interface BoardProps<G extends any = any> extends BgioBoardProps<G> {
  playerData: PlayerData[];
  allJoined: boolean;
  allReady: boolean;
}

export function makeBoardProps<G>(bgioProps: BgioBoardProps<G>): BoardProps<G> {

  const playerData = makePlayerData(bgioProps)

  let allJoined = true;
  let allReady = true;
  for (let pd of playerData) {
    if (pd.status !== "ready") {
      allReady = false;
    }
    if (pd.status === "not joined") {
      allJoined = false;
    }
  }

  return {
    ...bgioProps,
    playerData: playerData,
    allJoined: allJoined,
    allReady: allReady,
  };
}

// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps as BoardProps_} from "boardgame.io/react";

type MatchDataElem_ = Required<BoardProps_>["matchData"][0]; 

export interface MatchDataElem extends MatchDataElem_{
    isConnected?: boolean;
} 

// 'G extends any = any' is copied from Bgio. I don't see why it is better than 'any'.
export interface BoardProps<G=unknown> extends BoardProps_<G> {
    matchData?: Array<MatchDataElem>;
}
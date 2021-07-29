// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps as BgioBoardProps} from "boardgame.io/react";

type MatchDataElem_ = Required<BgioBoardProps>["matchData"][0]; 

export interface MatchDataElem extends MatchDataElem_{
    isConnected?: boolean;
} 

// 'G extends any = any' is copied from BoardProps. I don't see why it is better than 'any'.
/**
 * This BoardProps is an extending of BgioBoardProps Bgio BoardProps.
 */
export interface BoardProps<G extends any = any> extends BgioBoardProps<G> {
    matchData?: Array<MatchDataElem>;
    dummy: Number;
}

export function makeBoardProps<G>(bgioProps: BgioBoardProps<G>) : BoardProps<G> {
    return {...bgioProps, dummy: 1};
}
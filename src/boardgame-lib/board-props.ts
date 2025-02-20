// This file gives a work-around for an apparent bug in a Bgio type defition.

import { BoardProps as BoardProps_} from "./misc";

type MatchDataElem_ = Required<BoardProps_>["matchData"][0]; 

// The Bgio supplied version of MatchDataElem does not have
// isConnected as an optional elemeent.
export interface MatchDataElem extends MatchDataElem_{
    isConnected?: boolean;
} 

export interface BoardProps<G=unknown> extends BoardProps_<G> {
    matchData?: Array<MatchDataElem>;
}
import { sAssert } from "../../../utils/assert";
import { CardNonJoker, Rank, ranks } from "../../../utils/cards/types";

/** A shared pile that is build up during play */

export interface SharedPile {
    /** The top card of the pile (the rest of the pile is not recorded) */
    top: CardNonJoker | null;

    /** In general, the rank is null. But if 'top' is a king, this gives the effective rank */
    rank: Rank | null;
}

export function nextRank(sharedPile: SharedPile) : Rank {
    if(sharedPile.top === null) {
        return "A";
    }

    const currentRank = sharedPile.rank || sharedPile.top.rank;
    const newRank = ranks[ranks.indexOf(currentRank)+1];
    sAssert(newRank, "Cannot compute next rank");

    return newRank;
}

export function makeSharedPile(top: CardNonJoker) : SharedPile {
    const rank = top.rank === "K" ? "A" : null;
    return { top, rank };
}




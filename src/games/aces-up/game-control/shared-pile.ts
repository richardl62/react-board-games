import { Card } from "../../../utils/cards";
import { Rank } from "../../../utils/cards/types";

/** A shared pile that is build up during play */

export interface SharedPile {
    /** The top card of the pile (the rest of the pile is not recorded) */
    top: Card;

    /** In general, the rank is null. But if 'top' is a king, this gives the effective rank */
    rank: Rank | null;
}

export function makeSharedPile(top: Card) : SharedPile {
    const rank = top.rank === "K" ? "A" : null;
    return { top, rank };
}




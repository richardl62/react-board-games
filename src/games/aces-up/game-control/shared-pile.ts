import { CardNonJoker, Rank} from "../../../utils/cards/types";

export type SharedPileNonEmpty = {
    top: CardNonJoker;
    /** In general, the same as top.rank. But if 'top' is a wild card, this gives the effective rank */
    rank: Rank;
};

/** A shared pile that is built up during play */
export type SharedPile = {
    top: null,
    rank: null,
} | SharedPileNonEmpty;

export function makeSharedPile(top: CardNonJoker) : SharedPileNonEmpty {
    const rank = top.rank === "K" ? "A" : top.rank;
    return { top, rank };
}




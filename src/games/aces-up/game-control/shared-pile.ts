import { CardNonJoker, Rank} from "../../../utils/cards/types";

export type SharedPileNonEmpty = {
    /* The cards to be displayed. This will be the cards added this turn (index > 0), 
    plus the previous top card (index 0). */
    cards: CardNonJoker[];

    /** In general, the rank of cards[cards.length-1]. But if that card is wild, this gives the effective rank */
    rank: Rank;
};

/** A shared pile that is built up during play */
export type SharedPile = {
    cards: null,
    rank: null,
} | SharedPileNonEmpty;

export function makeSharedPile(top: CardNonJoker) : SharedPileNonEmpty {
    const rank = top.rank === "K" ? "A" : top.rank;
    return { cards: [top], rank };
}

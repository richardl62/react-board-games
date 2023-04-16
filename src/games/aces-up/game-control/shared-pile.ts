import { CardNonJoker, Rank, nextRank } from "../../../utils/cards/types";

export interface SharedPile {
    oldCards: CardNonJoker[];
    cardsPushedThisRound: CardNonJoker[];
}


export function getRank(cards: CardNonJoker[]): Rank | null {
    if(cards.length === 0) {
        return null;
    }

    const top = cards.at(-1)!;
    if(top.rank !== "K") {
        return top.rank;
    }

    const topRemoved = cards.slice(0,-1);
    return nextRank(getRank(topRemoved))!;
}

/** Return the effective rank of the top card in the pile,
 * or null if the pile is empty. 
 * The effective rank takes account of Kings. For example if the
 * actual ranks are ... 3, K, K the effective rank is 5.
 */
export function rank(pile: SharedPile): Rank | null {
    return getRank([...pile.oldCards, ...pile.cardsPushedThisRound]);
}

export function makeSharedPile(cards: CardNonJoker[] = []) : SharedPile {
    return {
        oldCards: cards,
        cardsPushedThisRound: [],
    };
} 

export function resetForStartOfRound(pile: SharedPile) {
    pile.oldCards.push(...pile.cardsPushedThisRound);
    pile.cardsPushedThisRound = [];
}

/** Return the top card, or undefined if there are no cards. */
export function topCard(pile: SharedPile) : CardNonJoker | undefined {
    return pile.cardsPushedThisRound.at(-1) || pile.oldCards.at(-1);
}

/** Return the top card, or undefined if there are no cards. */
export function removeTopCard(pile: SharedPile) : CardNonJoker | undefined {
    if(pile.cardsPushedThisRound.length > 0) {
        return pile.cardsPushedThisRound.pop();
    }

    return pile.oldCards.pop();
}
 



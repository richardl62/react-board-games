
import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";

// The whole CardSetID stuff is rather kludged.
export enum CardSetID {
    Me = "me",
    Pone = "pone",
    Shared = "shared",
}

export function makeCardSetID(value: string) : CardSetID {
    sAssert(value === CardSetID.Me ||
        value === CardSetID.Pone ||
        value === CardSetID.Shared, "string does not represent a card set");
        
    return value as CardSetID;
}


interface CardSetData {
    /** 'visible' cards.  Does not include cards in play */ 
    hand: Card[];
}

export interface GameState {
    me: CardSetData;
    pone: CardSetData;
    shared: CardSetData;

    // Kludge? The cut card is selected from the start but is shown only when
    // a player 'cuts' the deck.
    cutCard: {
        card: Card;
        visible: boolean;
    };
}

export const startingState: GameState = {
    me: {
        hand: [
            { rank: "A", suit: "S" },
            { rank: "2", suit: "S" },
            { rank: "3", suit: "S" },
            { rank: "4", suit: "S" }
        ],
    },

    pone: {
        hand: [
            { rank: "A", suit: "C" },
            { rank: "2", suit: "C" },
            { rank: "3", suit: "C" },
            { rank: "4", suit: "C" }
        ],
    },

    shared: {
        hand: [],
    },


    cutCard: { 
        card: {rank: "7", suit: "D" },
        visible: false,
    },
};

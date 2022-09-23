
import { Card } from "../../../utils/cards";

export type PlayerID = "me" | "pone";
export type HandID = PlayerID | "shared";

interface PlayerData {
    /** 'visible' cards.  Does not include cards in play */ 
    hand: Card[];
}

export interface GameState {
    me: PlayerData;
    pone: PlayerData;

    box: Card [];

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

    box: [],


    cutCard: { 
        card: {rank: "7", suit: "D" },
        visible: false,
    },
};

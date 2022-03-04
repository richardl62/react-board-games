
import { Card } from "../../../utils/cards";

interface PlayerData {
    /** includes cards currenyly in play, i.e. in box during box setting
     * or played during pegging.
     */
    fullHand: Card[];

    /** 'visible' cards.  Does not include cards in play */ 
    hand: Card[];

    /** Individual scores (not summed) */
    scores: number[];
}


export interface GameState {
    me: PlayerData;
    other: PlayerData;

    myBox: boolean;

    // Kludge? The cut card is selected from the start but is shown only when
    // a player 'cuts' the deck.
    cutCard: {
        card: Card;
        visible: boolean;
    };


    /* Info for different stages of game.  Exactly one will be set at all times.
    */
    addingCardsToBox?: {
        inBox: Card[];
    }

    pegging?: {
        meToPlay: boolean;
        played: Card[];
    } 

    scoringHands?: {
        box: Card[];
    }
}

export const startingState: GameState = {
    me: {
        fullHand: [], //kludge

        hand: [
            { rank: "A", suit: "S" },
            { rank: "2", suit: "S" },
            { rank: "3", suit: "S" },
            { rank: "4", suit: "S" }
        ],

        scores: [2,1,3],
    },

    other: {
        fullHand: [], //kludge

        hand: [
            { rank: "A", suit: "C" },
            { rank: "2", suit: "C" },
            { rank: "3", suit: "C" },
            { rank: "4", suit: "C" }
        ],

        scores: [],
    },

    myBox: true,
    cutCard: { 
        card: {rank: "7", suit: "D" },
        visible: false,
    },

    addingCardsToBox: {
        inBox: [],
    } 
};

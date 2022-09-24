
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

interface PlayerData extends CardSetData {
    /** Includes cards in play (i.e. those that have been played during pegging) */
    fullHand: Card[];
}

export enum GameStage  {
    SettingBox,
    Pegging,
    Scoring,
}

export interface GameState {
    me: PlayerData;
    pone: PlayerData;

    shared: CardSetData;

    stage: GameStage;

    box: Card [];

    // Kludge? The cut card is selected from the start but is shown only when
    // a player 'cuts' the deck.
    cutCard: {
        card: Card;
        visible: boolean;
    };
}

export function makeGameState() : GameState {

    const meHand : Card[] = [
        { rank: "A", suit: "S" },
        { rank: "2", suit: "S" },
        { rank: "3", suit: "S" },
        { rank: "4", suit: "S" }
    ];

    const poneHand : Card[]  = [
        { rank: "A", suit: "D" },
        { rank: "2", suit: "D" },
        { rank: "3", suit: "D" },
        { rank: "4", suit: "D" }
    ];

    return {
        me: {
            hand: meHand,
            fullHand: [...meHand],
        },

        pone: {
            hand: poneHand,
            fullHand: [...meHand],
        },

        shared: {
            hand: [],
        },

        box: [],

        stage: GameStage.SettingBox,

        cutCard: {
            card: { rank: "7", suit: "D" },
            visible: false,
        },
    };
}


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

export interface ServerData {
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

    serverError: string | null;
    serverTimestamp: number;
}




import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";

// The whole CardSetID stuff is rather kludged.
export enum CardSetID {
    Player0 = "player0",
    Player1 = "player1",
    Shared = "shared",
}

export type PlayerID = CardSetID.Player0 | CardSetID.Player1;

export function makeCardSetID(value: string) : CardSetID {
    sAssert(value === CardSetID.Player0 ||
        value === CardSetID.Player1 ||
        value === CardSetID.Shared, "string does not represent a card set");
        
    return value as CardSetID;
}

interface CardSetData {
    /** 'visible' cards.  Does not include cards in play */ 
    hand: Card[];
}

interface PerDealPlayerData extends CardSetData {
    /** Includes cards in play (i.e. those that have been played during pegging) */
    fullHand: Card[];

    /** Set true when player is finished adding cards to box */
    doneSettingBox: boolean;

    restartPeggingRequested: boolean;
}

export interface PegPositions {
    trailingPeg: number; // initialised to -1.
    score: number;
}

export interface PlayerData extends PerDealPlayerData, PegPositions {
}

export enum GameStage  {
    SettingBox,
    Pegging,
    Scoring,
}

export interface ServerData {
    player0: PlayerData;
    player1: PlayerData;

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



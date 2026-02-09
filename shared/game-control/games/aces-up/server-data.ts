import { PlayerID } from "../../playerid.js";
import { CardNonJoker } from "../../../utils/cards/types.js";
import { SharedPileData } from "./misc/shared-pile.js";
import { DiscardPileData } from "./misc/discard-pile.js";
import { GameOptions } from "./options.js";

export interface PlayerData {
    /** The pile that the player in trying to get rid of.
     * The card with index 0 is the most deeply burried.
     */
    mainPile: CardNonJoker[];

    hand: CardNonJoker[];

    /* For each discard pile, the card with index 0 is the most deeply burried. */
    discardPileData: [DiscardPileData, DiscardPileData, DiscardPileData];

    cardPlayedToSharedPiles: boolean;
}

type PlayerDataDictionary =  Record<string, PlayerData>
type MoveToSharedPile = 
    "not done" | 
    "done" |
    "omitted" // Not dome when it should have been, so user should be told.
    ;

export interface UndoItem {
    sharedPileData: SharedPileData[];
    playerID: PlayerID;
    playerData: PlayerDataDictionary;
    moveToSharedPile: MoveToSharedPile; 
}

// Server Data that is reset each turn
export interface PerTurnServerData {
    moveToSharedPile: MoveToSharedPile;
    undoItems: UndoItem[];
}

export interface ServerData extends PerTurnServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPileData: SharedPileData[];

    playerData: PlayerDataDictionary;

    options: GameOptions;
}



import { PlayerID } from "boardgame.io";
import { RequiredServerData } from "../../../app-game-support/required-server-data";
import { CardNonJoker } from "../../../utils/cards";
import { SharedPile } from "./shared-pile";
import { GameOptions } from "../game-support/options";

export interface PlayerData {
    /** The pile that the player in trying to get rid of.
     * The card with index 0 is the most deeply burried.
     */
    mainPile: CardNonJoker[];

    hand: CardNonJoker[];

    /* For each discard pile, the card with index 0 is the most deeply burried. */
    discards: [CardNonJoker[], CardNonJoker[], CardNonJoker[]];

    cardPlayedToSharedPiles: boolean;
}

type PlayerDataDictionary =  {[playerID: string]: PlayerData }
type MoveToSharedPile = "pending" | "done" | "required";

export interface UndoItem {
    sharedPiles: SharedPile[];
    playerID: PlayerID;
    playerData: PlayerData;
    moveToSharedPile: MoveToSharedPile; 
}

// Server Data that is reset each turn
export interface PerTurnServerData {
    moveToSharedPile: MoveToSharedPile;
    undoItems: UndoItem[];
}

export interface ServerData extends PerTurnServerData, RequiredServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPiles: SharedPile[];

    playerData: PlayerDataDictionary;

    options: GameOptions;
}



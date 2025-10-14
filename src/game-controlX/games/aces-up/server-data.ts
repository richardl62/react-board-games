import { PlayerID } from "@/game-controlX/playerid";
import { RequiredServerData } from "@/game-controlX/required-server-data";
import { CardNonJoker } from "@/utils/cards";
import { SharedPileData } from "./misc/shared-pile";
import { DiscardPileData } from "./misc/discard-pile";
import { Rank } from "@/utils/cards/types";

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

type PlayerDataDictionary =  {[playerID: string]: PlayerData }
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

export interface StartingOptions {
    readonly mainPileSize: number;
    readonly nSharedPilesAtStart: number;
    readonly addToSharedPileEachTurn: boolean;
    readonly canUseOpponentsWastePiles: boolean;
    readonly topRank: Rank;
    readonly thiefRank: Rank | null;
    readonly killerRank: Rank | null;
}

export interface ServerData extends PerTurnServerData, RequiredServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPileData: SharedPileData[];

    playerData: PlayerDataDictionary;

    options: StartingOptions;
}



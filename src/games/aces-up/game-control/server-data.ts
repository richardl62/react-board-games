import { CardNonJoker } from "../../../utils/cards";
import { SharedPile } from "./shared-pile";

export interface PlayerData {
    /** The pile that the player in trying to get rid of */
    mainPile: CardNonJoker[];

    hand: CardNonJoker[];

    discards: [CardNonJoker[], CardNonJoker[], CardNonJoker[]];

    cardPlayedToSharedPiles: boolean;
}

type PlayerDataDictionary =  {[playerID: string]: PlayerData }

// Server Data that is reset each turn
export interface PerTurnServerData {
    moveToSharedPile: "pending" | "done" | "required";
    undoAvailable: boolean;
}

export interface ServerData extends PerTurnServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPiles: SharedPile[];

    playerData: PlayerDataDictionary;



    serverError: string | null;
    serverTimestamp: number;
}



import { CardNonJoker } from "../../../utils/cards";
import { SharedPile } from "./shared-pile";

export interface PlayerData {
    /** The pile that the player in trying to get rid of */
    mainPile: CardNonJoker[];

    hand: CardNonJoker[];

    discards: [CardNonJoker[], CardNonJoker[], CardNonJoker[]];
}

type PlayerDataDictionary =  {[playerID: string]: PlayerData }

export interface ServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPiles: SharedPile[];

    playerData: PlayerDataDictionary;

    cardAddedToSharedPiles: boolean;

    message: string;

    serverError: string | null;
    serverTimestamp: number;
}



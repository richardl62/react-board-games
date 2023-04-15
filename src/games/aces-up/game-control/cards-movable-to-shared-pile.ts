import { PlayerID } from "boardgame.io";
import { CardNonJoker } from "../../../utils/cards";
import { moveableToSharedPile } from "./move-type";
import { PlayerData, ServerData } from "./server-data";

function moveableCards(playerData: PlayerData) {
    const moveable: CardNonJoker[] = [];
    for(const discardPile of playerData.discards) {
        if(discardPile.length > 0) {
            moveable.push(discardPile[discardPile.length-1]);
        }
    }

    for(const card of playerData.hand) {
        moveable.push(card);
    }

    if(playerData.mainPile.length > 0) {
        moveable.push(playerData.mainPile.slice(-1)[0]);
    }

    return moveable;
}

export function cardsMovableToSharedPile(
    G: ServerData, 
    playerID: PlayerID
) : CardNonJoker[] {
    
    const moveable = (card: CardNonJoker) => {
        for(const pile of G.sharedPiles) {
            if(moveableToSharedPile(G,card, pile)) {
                return true;
            }
        }

        return false;
    };
    
    return moveableCards(G.playerData[playerID]).filter(moveable);
}

import { Ctx, PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { debugOptions } from "../game-support/config";
import { addCard, removeCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { cardsMovableToSharedPile } from "./cards-movable-to-shared-pile";
import { endTurn, refillHand } from "./end-turn";
import { PlayerData, ServerData } from "./server-data";

function moveToSharedPileRequired(G: ServerData, playerID: PlayerID) {
    return G.moveToSharedPile !== "done" &&
        cardsMovableToSharedPile(G, playerID).length !== 0 && 
        !debugOptions.skipRequirementToAddToSharedPiles; 
}

function moveWithinSharedPiles(
    playerData: PlayerData, 
    {from, to}: {from: CardID, to: CardID},
)
{
    sAssert(from.area === "discardPiles" && from.cardIndex !== "any");
    sAssert(to.area === "discardPiles" && to.cardIndex === "any");
    sAssert(from.pileIndex != to.pileIndex);

    const fromPile = playerData.discards[from.pileIndex];
    const toPile = playerData.discards[to.pileIndex];

    const movedCards = fromPile.splice(0, from.cardIndex+1);
    toPile.splice(0,0,...movedCards);
}

export function moveCard(
    G: ServerData, 
    ctx: Ctx, 
    /** PlayerID is the ID of the play who requested the move */
    {from, to}: {from: CardID, to: CardID},
) : void {
    const playerID = ctx.currentPlayer;
    sAssert(from.area !== "sharedPiles", "Card played from shared piles" );
    sAssert(from.owner === playerID, "Unexpected card owner");
    sAssert(to.area === "sharedPiles" || to.owner === playerID, "Unexpected card owner");

    const playerData = G.playerData[playerID];

    if (to.area === "discardPiles") {
        if (moveToSharedPileRequired(G, playerID)) {
            G.moveToSharedPile = "required";
            return;
        }

        if(from.area === "discardPiles") {
            moveWithinSharedPiles(playerData, {from, to});
            return;
        }
    }

    const card = removeCard(G, from);
    addCard(G, to, card);

    if(to.area === "discardPiles") {
        endTurn(G, ctx);
    } else {
        if (playerData.hand.length === 0) {
            refillHand(G, ctx, playerID);
        }

        if (to.area === "sharedPiles") {
            G.moveToSharedPile = "done";
        }
    }
}
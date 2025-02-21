import { PlayerID } from "../../../boardgame-lib/playerid";
import { MoveArg0 } from "../../../boardgame-lib/game";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/reorder-following-drag";
import { sameJSON } from "../../../utils/same-json";
import { addCard, clearPile, removeCard, stealTopCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { cardsMovableToSharedPile } from "./cards-movable-to-shared-pile";
import { DiscardPile } from "./discard-pile";
import { endTurn, refillHand } from "./end-turn";
import { makeDiscardPiles } from "./make-discard-pile";
import { moveType as getMoveType } from "./move-type";
import { ServerData, UndoItem } from "./server-data";
import { makeUndoItem } from "./undo";

function moveToSharedPileRequired(G: ServerData, playerID: PlayerID) {
    return G.options.addToSharedPileEachTurn &&
        G.moveToSharedPile !== "done" &&
        cardsMovableToSharedPile(G, playerID).length !== 0; 
}

function moveWithinDiscardPiles(
    discardPiles: DiscardPile[],
    {from, to}: {from: CardID, to: CardID},
)
{
    sAssert(from.area === "discardPileCard");
    sAssert(to.area === "discardPileAll");
    sAssert(from.pileIndex !== to.pileIndex);

    const fromPile = discardPiles[from.pileIndex];
    const toPile = discardPiles[to.pileIndex];

    const movedCards = fromPile.removeFromTop(
        fromPile.length - from.cardIndex
    );
    toPile.add(...movedCards);
}

function doMoveCard(
    arg0 : MoveArg0<ServerData>, 
    /** PlayerID is the ID of the play who requested the move */
    {from, to}: {from: CardID, to: CardID},
) : UndoItem | null
{
    const { G, ctx } = arg0;
    const playerID = ctx.currentPlayer;
    const playerData = G.playerData[playerID];

    let undoItem : UndoItem | null = makeUndoItem(G, playerID);

    const moveType = getMoveType(arg0, {from, to});
    if (moveType === "steal") {
        const fromCard = removeCard(G, from);
        const stollenCard = stealTopCard(G, to, fromCard);
        addCard(G,from,stollenCard);
    } else if (moveType === "clear") {
        const fromCard = removeCard(G, from);
        clearPile(G, to, fromCard);
    } else if(to.area === "hand" && from.area === "hand") {
        sAssert(to.owner === playerID && from.owner === playerID);
        reorderFollowingDrag(playerData.hand, from.index, to.index);
        undoItem = null;
    } else if(to.area === "discardPileAll" && from.area === "discardPileCard") {
        moveWithinDiscardPiles(makeDiscardPiles(G, playerID), {from, to});
    } else {
        const card = removeCard(G, from);
        addCard(G, to, card);
    }
    
    return undoItem;

}

export function moveCard(
    arg0 : MoveArg0<ServerData>, 
    /** PlayerID is the ID of the play who requested the move */
    {from, to}: {from: CardID, to: CardID},
) : void {
    const { G, ctx } = arg0;
    const playerID = ctx.currentPlayer;

    if (sameJSON(from, to)) {
        return;
    }
    
    const moveType = getMoveType(arg0, {from, to});

    // Check move is valid. (Most of the checking is done in canDrag()/canDrop(). 
    // But the check that cards are played to discard piles before ending
    // the turn is done here.)
    const endOfTurn = moveType === "move" && to.area === "discardPileAll";

    if (endOfTurn){
        if (moveToSharedPileRequired(G, playerID)) {
            G.moveToSharedPile = "omitted";
            return;
        }
    }

    const undoItem = doMoveCard(arg0, {from, to});
    

    if (from.owner === playerID && to.area === "sharedPiles") {
        G.moveToSharedPile = "done";
    }

    // Post-move actions
    if(endOfTurn) {
        endTurn(arg0);
    } else {
        const playerData = G.playerData[playerID];
        if (playerData.hand.length === 0) {
            refillHand(arg0, playerID);
            G.undoItems = [];
        } else {
            if(undoItem) {
                G.undoItems.push(undoItem); 
            }
        }
    }
}

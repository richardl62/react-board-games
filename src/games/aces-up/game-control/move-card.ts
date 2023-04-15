import { PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/reorder-following-drag";
import { addCard, clearPile, getCard, removeCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { cardsMovableToSharedPile } from "./cards-movable-to-shared-pile";
import { endTurn, refillHand } from "./end-turn";
import { PlayerData, ServerData, UndoItem } from "./server-data";
import { makeUndoItem } from "./undo";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { OptionWrapper } from "../game-support/game-options";
import { isPlayersDiscardPile } from "./can-drop";

function moveToSharedPileRequired(G: ServerData, playerID: PlayerID) {
    return G.options.addToSharedPileEachTurn &&
        G.moveToSharedPile !== "done" &&
        cardsMovableToSharedPile(G, playerID).length !== 0; 
}

function moveWithinSharedPiles(
    playerData: PlayerData, 
    {from, to}: {from: CardID, to: CardID},
)
{
    sAssert(from.area === "discardPileCard");
    sAssert(to.area === "discardPileAll");
    sAssert(from.pileIndex != to.pileIndex);

    const fromPile = playerData.discards[from.pileIndex];
    const toPile = playerData.discards[to.pileIndex];

    const movedCards = fromPile.splice(
        from.cardIndex, 
        fromPile.length - from.cardIndex);
    toPile.push(...movedCards);
}

export function moveCard(
    arg0 : MoveArg0<ServerData>, 
    /** PlayerID is the ID of the play who requested the move */
    {from, to}: {from: CardID, to: CardID},
) : void {
    const { G, ctx } = arg0;
    const playerID = ctx.currentPlayer;
    const options = new OptionWrapper(G.options);

    const fromCard = getCard(G, from);
    sAssert(fromCard);
    
    // Check move is valid. (Most of the checking is done in canDrag()/canDrop(). 
    // But the check that cards are played to discard piles before ending
    // the turn is done here.)
    const endOfTurn = to.area === "discardPileAll"
        && !options.isThief(fromCard)
        && !options.isKiller(fromCard);

    if (endOfTurn){
        if (moveToSharedPileRequired(G, playerID)) {
            G.moveToSharedPile = "omitted";
            return;
        }
    }
    
    const playerData = G.playerData[playerID];

    let undoItem : UndoItem | null = makeUndoItem(G, playerID);

    // Do the move
    if(to.area === "hand" && from.area === "hand") {
        sAssert(to.owner === playerID && from.owner === playerID);
        reorderFollowingDrag(playerData.hand, from.index, to.index);
        undoItem = null;
    } else if(options.isThief(fromCard) && !isPlayersDiscardPile(playerID, to)) {
        removeCard(G, from);
        const toCard = removeCard(G, to);
        addCard(G,from,toCard);
    } else if(options.isKiller(fromCard) && !isPlayersDiscardPile(playerID, to)) {
        removeCard(G, from);
        clearPile(G, to);
    } else if(to.area === "discardPileAll" && from.area === "discardPileCard") {
        moveWithinSharedPiles(playerData, {from, to});
    } else {
        const card = removeCard(G, from);
        addCard(G, to, card);
    }
    
    if (from.owner === playerID && to.area === "sharedPiles") {
        G.moveToSharedPile = "done";
    }

    // Post-move actions
    if(endOfTurn) {
        endTurn(arg0);
    } else {
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

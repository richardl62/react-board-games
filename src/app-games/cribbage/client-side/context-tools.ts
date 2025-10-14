import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { compareCards } from "../../../utils/cards/types";
import { cardInBoxPerPlayer } from "../config";
import { CardSetID, GameStage, PlayerID } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";

function includes(cardSet: Card[], card: Card) {
    for (const c of cardSet) {
        if (compareCards(c, card) === 0) {
            return true;
        }
    }

    return false;
}

export function owner(
    context: CribbageContext,
    card: Card,
): PlayerID {

    if (includes(context.player0.fullHand, card)) {
        return CardSetID.Player0;
    }

    if (includes(context.player1.fullHand, card)) {
        return CardSetID.Player1;
    }

    throw new Error("Card does not have known owner");
}

function nCardsInBox(context: CribbageContext, playerID: PlayerID) : number {
    sAssert(context.stage === GameStage.SettingBox);
    
    let count = 0;
    for(const card of context.shared.hand) {
        if(owner(context, card) === playerID) {
            ++count;
        }
    }

    return count;
}

export function boxFull(context: CribbageContext, playerID: PlayerID) : boolean {
    return nCardsInBox(context, playerID) === cardInBoxPerPlayer;
}
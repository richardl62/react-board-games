import { Card } from "../../../utils/cards";
import { compareCards } from "../../../utils/cards/types";
import { CardSetID, PlayerID } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";

function owner(context: CribbageContext,  
    id: {cardSetID: CardSetID, index: number}) : PlayerID {

    const includes = (cardSet: Card[], card: Card) => {
        for(const c of cardSet) {
            if(compareCards(c, card) === 0) {
                return true;
            }
        }

        return false;
    };

    const card = context[id.cardSetID].hand[id.index];
    if(!card) {
        console.error("unknown card");
        return CardSetID.Player0;

    }
    if(includes(context.player0.fullHand, card)) {
        return CardSetID.Player0;
    }

    if(includes(context.player1.fullHand, card)) {
        return CardSetID.Player1;
    }

    throw new Error("Card does not have known owner");
}


export function dragAllowed(context: CribbageContext, 
    id: {cardSetID: CardSetID, index: number}
) : boolean {

    return owner(context, id) === context.me;
}

export function showBack(context: CribbageContext, 
    id: {cardSetID: CardSetID, index: number}
) : boolean {
    return !dragAllowed(context, id);
}


export function dropTarget(context: CribbageContext,
    id: {cardSetID: CardSetID, index?: number} 
) : boolean {
    return id.cardSetID !== context.pone;
}


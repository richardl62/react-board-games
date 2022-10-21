import { CardSetID, GameStage } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";
import { boxFull, owner } from "./context-tools";
import { sAssert } from "../../../utils/assert";

export function dragAllowed(context: CribbageContext, 
    id: {cardSetID: CardSetID, index: number}
) : boolean {
    const card = context[id.cardSetID].hand[id.index];
    sAssert(card);
    return owner(context, card) === context.me;
}

export function showBack(context: CribbageContext, 
    id: {cardSetID: CardSetID, index: number}
) : boolean {
    return !dragAllowed(context, id);
}


export function dropTarget(context: CribbageContext,
    id: {cardSetID: CardSetID, index?: number} 
) : boolean {
    const { cardSetID, index } = id;

    if(cardSetID === context.me) {
        // Reordering hand
        return true;
    }

    if(cardSetID === CardSetID.Shared && index === undefined) {
        if(context.stage === GameStage.SettingBox) {
            return !boxFull(context, context.me);
        }

        return true;
    }



    return false;
}


import { CardSetID, GameStage } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";
import { boxFull, owner } from "./context-tools";
import { sAssert } from "../../../utils/assert";

export function dragAllowed(
    context: CribbageContext, 
    cardSetID: CardSetID, 
    index: number,
) : boolean {
    const { stage, me} = context;

    
    if(stage === GameStage.SettingBox) {
        const card = context[cardSetID].hand[index];
        sAssert(card);
        return owner(context, card) === me;
    }

    if(stage === GameStage.Pegging) {
        return cardSetID === me;
    }

    if(stage === GameStage.HandsRevealed) {
        return false;
    }

    throw new Error("Unexpected GameStage"); // Why does typescript require this?
}

export function showBack(
    context: CribbageContext, 
    cardSetID: CardSetID,
    index: number,
) : boolean {

    const { stage, pone} = context;
    
    if(stage === GameStage.SettingBox) {
        return !dragAllowed(context, cardSetID, index);
    }

    if(stage === GameStage.Pegging) {
        return cardSetID === pone;
    }

    if(stage === GameStage.HandsRevealed) {
        return false;
    }

    throw new Error("Unexpected GameStage"); // Why does typescript require this?
}


export function dropTarget(context: CribbageContext,
    cardSetID: CardSetID, 
    index?: number,
) : boolean {

    const { stage, pone} = context;

    if(stage === GameStage.SettingBox) {
        if(cardSetID === context.me) {
            return true;
        }

        return cardSetID === CardSetID.Shared && index === undefined &&
            !boxFull(context, context.me);
    }

    if(stage === GameStage.Pegging) {
        return cardSetID !== pone;
    }

    if(stage === GameStage.HandsRevealed) {
        return false;
    }

    throw new Error("Unexpected GameStage"); // Why does typescript require this?

    return false;
}


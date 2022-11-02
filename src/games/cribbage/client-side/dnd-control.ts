import { CardSetID, GameStage } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";
import { boxFull, owner } from "./context-tools";
import { sAssert } from "../../../utils/assert";

export function dragAllowed(
    context: CribbageContext, 
    cardSetID: CardSetID, 
    index: number,
) : boolean {
    const { stage, me, numPlayers} = context;
    const singlePlayer = numPlayers === 1;
    
    if(stage === GameStage.SettingBox) {
        const card = context[cardSetID].hand[index];
        sAssert(card);
        return owner(context, card) === me || singlePlayer;
    }

    if(stage === GameStage.Pegging) {
        return cardSetID === me || singlePlayer;
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

    const { stage, pone, numPlayers} = context;
    const singlePlayer = numPlayers === 1;

    if(stage === GameStage.SettingBox) {
        return !dragAllowed(context, cardSetID, index);
    }

    if(stage === GameStage.Pegging) {
        return cardSetID === pone && !singlePlayer;
    }

    if(stage === GameStage.HandsRevealed) {
        return false;
    }

    throw new Error("Unexpected GameStage"); // Why does typescript require this?
}


export function dropTarget(
    context: CribbageContext,
    cardSetID: CardSetID, 
    index?: number,
) : boolean {

    const { stage, pone, numPlayers} = context;
    const singlePlayer = numPlayers === 1;

    if(stage === GameStage.SettingBox) {
        // Could do better if the start of the drag was known
        if(singlePlayer) {
            return true;
        }

        if(cardSetID === context.me) {
            return true;
        }

        return cardSetID === CardSetID.Shared && index === undefined &&
            !boxFull(context, context.me);
    }

    if(stage === GameStage.Pegging) {
        return cardSetID !== pone || singlePlayer && index === undefined;
    }

    if(stage === GameStage.HandsRevealed) {
        return false;
    }

    throw new Error("Unexpected GameStage"); // Why does typescript require this?

    return false;
}


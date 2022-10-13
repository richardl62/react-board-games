import { CardSetID } from "../server-side/server-data";
import { CribbageContext } from "./cribbage-context";

export function dragAllowed(context: CribbageContext, 
    id: {cardSetID: CardSetID, index: number}
) : boolean {
    return id.cardSetID !== context.pone;
}

export function dropTarget(context: CribbageContext,
    id: {cardSetID: CardSetID, index?: number} 
) : boolean {
    if(id.index === undefined) {
        return id.cardSetID === "shared";
    }
    return id.cardSetID !== context.pone;
}
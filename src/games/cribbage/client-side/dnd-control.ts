import { CardDndID } from "../../../utils/cards/card-dnd";
import { CribbageContext } from "./cribbage-context";

export function dragAllowed(context: CribbageContext, id: CardDndID) : boolean {
    return id.handID !== context.pone;
}

export function dropTarget(context: CribbageContext, id: CardDndID) : boolean {
    if(id.index === null) {
        return id.handID === "shared";
    }
    return id.handID !== context.pone;
}
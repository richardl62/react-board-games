import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { sAssert } from "../../../utils/assert";
import { CardID } from "./card-id";
import { ClientMoves } from "./moves";
import { ServerData } from "./server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function isDraggable(
    gameContext: TypedGameProps,
    id: CardID) : boolean {

    if (id.area === "sharedPiles") {
        return false;
    }

    if(id.owner !== gameContext.ctx.currentPlayer) {
        // Not this players turn.
        return false;
    }

    if (id.area === "playerPile") {
        return true;
    }

    if (id.area === "hand") {
        return true;
    }

    if (id.area === "discardPiles") {
        // Only the top card in the pile can be dragged.
        return id.cardIndex === 0;
    }

    sAssert(false,"Unexpect card id");
}
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { sAssert } from "../../../utils/assert";
import { CardLocation } from "./card-location";
import { ClientMoves } from "./moves";
import { ServerData } from "./server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function isDraggable(
    gameContext: TypedGameProps,
    location: CardLocation) : boolean {

    if (location.area === "sharedPiles") {
        return false;
    }

    if(location.owner !== gameContext.ctx.currentPlayer) {
        // Not this players turn.
        return false;
    }

    if (location.area === "playerPile") {
        return true;
    }

    if (location.area === "hand") {
        return true;
    }

    if (location.area === "discardPiles") {
        // Only the top card in the pile can be dragged.
        return location.cardIndex === 0;
    }

    sAssert(false,"Unexpect card location");
}
import React from "react";
import { cardShortName } from "../../../utils/cards/types";
import { cardsMovableToSharedPile } from "../game-control/cards-movable-to-shared-pile";
import { useGameContext } from "../game-support/game-context";

interface Props {
    playerID: string;
}

export function IllegalMoveNotification(props: Props) : JSX.Element | null {
    const {playerID: inputPlayerID} = props;
    const {
        playerID: bgioPlayerID, 
        G, 
        ctx: {currentPlayer}
    } = useGameContext();

    if (G.moveToSharedPile !== "required") {
        // No notification needed
        return null;
    }

    if (currentPlayer !== inputPlayerID) {
        // Notification not for this player
        return null;
    }

    if (currentPlayer !== bgioPlayerID) {
        // Not viewing data for this player
        return null;
    }

    const moveOptions = () => {
        const movableCards = cardsMovableToSharedPile(G, currentPlayer);
        return movableCards.map(card => cardShortName(card));
    };

    return <div>
        <span>You must move card to a shared pile</span>
        <span>{` (Options: ${moveOptions().join(", ")})`}</span>
    </div>;
}
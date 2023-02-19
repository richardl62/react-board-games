import React from "react";
import { cardShortName } from "../../../utils/cards/types";
import { cardsMovableToSharedPile } from "../game-control/cards-movable-to-shared-pile";
import { useGameContext } from "../game-support/game-context";
import { PlayerInfo } from "./player-info";

interface Props {
    playerInfo: PlayerInfo;
}

export function IllegalMoveNotification(props: Props) : JSX.Element | null {
    const {playerInfo} = props;
    
    const {G} = useGameContext();

    if (G.moveToSharedPile !== "required") {
        // No notification needed
        return null;
    }

    if (playerInfo.owner !== playerInfo.viewer) {
        return null;
    }

    if (playerInfo.owner !== playerInfo.currentPlayer) {
        return null;
    }

    const moveOptions = () => {
        const movableCards = cardsMovableToSharedPile(G, playerInfo.currentPlayer);
        return movableCards.map(card => cardShortName(card));
    };

    return <div>
        <span>You must move card to a shared pile</span>
        <span>{` (Options: ${moveOptions().join(", ")})`}</span>
    </div>;
}
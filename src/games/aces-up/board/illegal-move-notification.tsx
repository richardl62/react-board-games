import React from "react";
import { sAssert } from "../../../utils/assert";
import { compareRank, rankName } from "../../../utils/cards/types";
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

    const movableCards = cardsMovableToSharedPile(G, playerInfo.currentPlayer);
    sAssert(movableCards.length > 0, "Illegal move warning, but no movable cards found");

    const ranks = movableCards.map(card => card.rank);

    const sortedRankNames = ranks.sort(compareRank).map(rankName);

    return <div>
        <span>You must move card to a shared pile</span>
        <span>{` (Your movable ranks: ${sortedRankNames.join(", ")})`}</span>
    </div>;
}
import React from "react";
import { useGameContext } from "../game-support/game-context";

export function ConfirmPenaltyCard() : JSX.Element | null {
    const {
        playerID, moves, getPlayerName, undo,
        G: {status}, 
        ctx: {currentPlayer}
    } = useGameContext();

    if (!status.penaltyConfirmationRequired) {
        return null;
    }

    if (playerID !== currentPlayer) {
        const name = getPlayerName(currentPlayer);
        return <div>{`waiting for ${name} to confirm penalty card`}</div>;
    }

    return <div>
        <button onClick={() => moves.confirmPenaltyCard()}>
            Confirm penalty Card
        </button>
        <button onClick={() => undo()}>
            Undo
        </button>
    </div>;
}
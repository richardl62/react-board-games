import React from "react";
import { useGameContext } from "../game-support/game-context";

interface Props {
    playerID: string;
}

export function ConfirmPenaltyCard(props: Props) : JSX.Element | null {
    const {playerID: inputPlayerID} = props;
    const {
        playerID: bgioPlayerID, moves, undo,
        G: {status}, 
        ctx: {currentPlayer}
    } = useGameContext();

    if (!status.penaltyConfirmationRequired) {
        // No penalty
        return null;
    }

    // If we have got here, currentPlayer is facing a penalty.

    if (currentPlayer !== inputPlayerID) {
        // Not this player penalty
        return null;
    }


    const disableButtons = currentPlayer !== bgioPlayerID;

    return <div>
        <button onClick={() => moves.confirmPenaltyCard()} 
            disabled={disableButtons}
        >
            Confirm penalty Card
        </button>
        <button onClick={() => undo()} disabled={disableButtons}>
            Undo
        </button>
    </div>;
}
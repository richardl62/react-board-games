import React from "react";
import { useGameContext } from "../client-side/game-context";

export function RollBustStop() : JSX.Element {
    const { 
        G: {rollCount, turnOverRollCount, diceScores, scoreCarriedOver}, 
        moves, playerID 
    } = useGameContext();
    const turnOver = turnOverRollCount === rollCount;

    const onBust = () => {
        moves.turnOver();
    };

    const onDone = () => {
        moves.recordScore({playerID, 
            score: diceScores.held + scoreCarriedOver,
        });
        moves.turnOver();
    };

    return <div>
        <button onClick={() => moves.roll()} disabled={turnOver}>Roll</button>
        <button onClick={() => moves.rollAll()}>Roll All</button>
        <button onClick={onDone}>Done</button>
        <button onClick={onBust}>Bust</button>
    </div>;
}
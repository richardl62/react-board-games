import React from "react";
import { useGameContext } from "../client-side/game-context";

export function RollBustStop() : JSX.Element {
    const { G: {rollCount, bustRollCount}, moves, events } = useGameContext();
    const bust = bustRollCount === rollCount;

    const onBust = () => {
        moves.bust();
        events.endTurn();
    };

    return <div>
        <button onClick={() => moves.roll()} disabled={bust}>Roll</button>
        <button onClick={() => moves.rollAll()}>Roll All</button>
        <button onClick={onBust}>Bust</button>
    </div>;
}
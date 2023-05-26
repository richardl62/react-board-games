import React from "react";
import { useGameContext } from "../client-side/game-context";

export function RollBustStop() : JSX.Element {
    const { moves } = useGameContext();
    return <div>
        <button onClick={() => moves.roll()}>Roll</button>
        <button onClick={() => moves.rollAll()}>Roll All</button>
    </div>;
}
import React from "react";
import { useGameContext } from "../client-side/game-context";

export function RollBustStop() : JSX.Element {
    const { moves } = useGameContext();
    return <button onClick={() => moves.roll()}>Roll</button>;
}
import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";

export function GameDiceSet(): JSX.Element {
    const {
        G: { faces, rollCount, held, turnOverRollCount, }, ctx: { currentPlayer }, playerID, diceRotation, moves
    } = useGameContext();
    const turnOver = turnOverRollCount === rollCount;

    let onDiceClick;
    if (!turnOver && playerID === currentPlayer && diceRotation === null) {
        onDiceClick = (i: number) => moves.setHeld({ index: i, held: !held[i] });
    }

    return <DiceSet
        faces={faces}
        rotation={diceRotation}
        held={held}
        onDiceClick={onDiceClick} />;
}

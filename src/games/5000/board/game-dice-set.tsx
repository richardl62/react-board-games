import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { moveHeldFacesToStart } from "../utils/move-held-faces-to-start";

export function GameDiceSet(): JSX.Element {
    const {
        G, ctx: { currentPlayer }, playerID, diceRotation, moves
    } = useGameContext();
    const turnOver = G.turnOverRollCount === G.rollCount;
    const { faces, held } = diceRotation ? moveHeldFacesToStart(G) : G;

    let onDiceClick;
    if (!turnOver && playerID === currentPlayer && diceRotation === null) {
        onDiceClick = (i: number) => moves.setHeld({ index: i, held: !held[i] });
    }
    const rotateAll = diceRotation && diceRotation.allDice;
    return <DiceSet
        faces={faces}
        rotation={diceRotation && diceRotation.angle}
        held={rotateAll? Array(6).fill(false) : held}
        onDiceClick={onDiceClick}
    />;
}

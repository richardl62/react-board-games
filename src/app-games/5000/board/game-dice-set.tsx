import { JSX } from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { moveHeldFacesToStart } from "../utils/move-held-faces-to-start";

export function GameDiceSet(): JSX.Element {
    const {
        G, holdAllowed, diceRotation, moves
    } = useGameContext();
    const { faces, held } = diceRotation ? moveHeldFacesToStart(G) : G;

    let onDiceClick;
    if (holdAllowed) {
        onDiceClick = (i: number) => {
            const newHeld = [...held];
            newHeld[i] = !newHeld[i]; 
            moves.setHeld(newHeld);
        };
    }
    const rotateAll = diceRotation && diceRotation.allDice;
    return <DiceSet
        faces={faces}
        rotation={diceRotation && diceRotation.angle}
        held={rotateAll? Array(6).fill(false) : held}
        onDiceClick={onDiceClick}
    />;
}

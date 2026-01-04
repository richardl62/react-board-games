import { JSX } from "react";
import { useMatchState } from "../match-state";
import { getAvailableColumnIncreases } from "./available-colum-increases";
import { useDiceRotation } from "./rolling-dice";
import { Dice } from "@/utils/dice/dice";

export function TurnControl() : JSX.Element {
    const { G: {diceValues} } = useMatchState();
    
    const diceRotation = useDiceRotation();

    const makeDice = (index: number) => (
        <Dice key={"d" + index} face={diceValues[index]} rotation={diceRotation} color={"darkred"} />
    );

    // Crude for now.
    return <div>
        <div> {makeDice(0)} {makeDice(1)} </div>
        <GameButtons />
        <div> {makeDice(2)} {makeDice(3)} </div>
    </div>;
}

function GameButtons() : JSX.Element {
    const { G, ctx, playerID, moves } = useMatchState();
    
    const allowMoves = ctx.currentPlayer === playerID;
    const availableIncreases = getAvailableColumnIncreases(G, ctx);

    if (G.rollCount.thisTurn === 0) {
        return <button onClick={() => moves.roll()} disabled={!allowMoves}>
            Roll
        </button>;
    }

    if (availableIncreases.length === 0) {
        return <button onClick={() => moves.bust()} disabled={!allowMoves}>
            Bust
        </button>
    }

    return <div>
        <button onClick={() => moves.roll()} disabled={!allowMoves}>
            Roll
        </button>

        {availableIncreases.map((increaseOption, idx) => (
            <button
                key={idx}
                onClick={() => moves.recordScoringChoice(increaseOption)}
                disabled={!allowMoves}
            >
                {increaseOption.join(", ")}
            </button>
        ))}

        <button onClick={() => moves.stopRolling()} disabled={!allowMoves}>
            Don't
        </button>
    </div>
}
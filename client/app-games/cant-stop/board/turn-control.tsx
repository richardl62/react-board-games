import { JSX } from "react";
import { useGameContext } from "../game-context";
import { getAvailableColumnIncreases } from "./available-colum-increases";
import { RollingDice, useDiceRollStep } from "./rolling-dice";

export function TurnControl() : JSX.Element {
    const { G, ctx, playerID, moves } = useGameContext();
    
    const allowMoves = ctx.currentPlayer === playerID;
    const availableIncreases = getAvailableColumnIncreases(G, ctx);
    const rollStep = useDiceRollStep();

    // Crude for now.
    return <div>
        {G.diceValues.map((value, idx) => (
            <RollingDice key={idx} value={value} rollStep={rollStep} color={"darkred"} />
        ))}
        <div>
            <button onClick={() => moves.roll()} disabled={!allowMoves}>
                Roll
            </button>

            {availableIncreases.map((increaseOption, idx) => ( 
                <button 
                    key={idx} 
                    onClick={() => moves.addToColumns(increaseOption)}         
                    disabled={!allowMoves}
                >
                    {increaseOption.join(", ")}
                </button>
            ))}

            <button onClick={() => moves.stopRolling()} disabled={!allowMoves}>
                Don't
            </button>

            <button onClick={() => moves.bust()} disabled={!allowMoves}>
                Bust
            </button>
        </div>
    </div>;
}
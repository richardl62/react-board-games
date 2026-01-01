import { JSX } from "react";
import { useGameContext } from "../game-context";
import { getAvailableColumnIncreases } from "./available-colum-increases";

export function TurnControl() : JSX.Element {
    const {
        G,
        ctx, 
        playerID,
        moves,
    } = useGameContext();
    
    const allowMoves = ctx.currentPlayer === playerID;
    const availableIncreases = getAvailableColumnIncreases(G, ctx);

    // Very crude for now.
    return <div>
        <div>{`Dice: ${G.diceValues.join(", ")}`}</div>
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
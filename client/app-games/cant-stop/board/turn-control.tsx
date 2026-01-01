import { JSX } from "react";
import { useGameContext } from "../game-context";
import { useAvailableColumnIncreases } from "./use-available-colum-increases";

export function TurnControl() : JSX.Element {
    const {
        G: {diceValues},
        ctx: {currentPlayer}, 
        playerID,
        moves,
    } = useGameContext();
    
    const allowMoves = currentPlayer === playerID;
    const availableIncreases = useAvailableColumnIncreases();

    // Very crude for now.
    return <div>
        <div>{`Dice: ${diceValues.join(", ")}`}</div>
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
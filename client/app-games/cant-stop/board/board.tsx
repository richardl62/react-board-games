import { JSX } from "react";
import { useGameContext } from "../game-context";
import { Columns } from "./columns";

function Board() : JSX.Element {
    const {
        G: {diceValues},
        ctx: {currentPlayer}, 
        playerData, 
        playerID,
        moves,
        events,
    } = useGameContext();
    
    // Very crude board for now.
    return <div>
        <div>{`Current player: ${playerData[currentPlayer].name}`}</div>
        <Columns/>

        <div>{`Dice values: ${diceValues.join(", ")} `}</div>
        <div>
            <button onClick={() => moves.roll()}
                disabled={playerID !== currentPlayer}
            >
                Roll
            </button>
            <button onClick={() => events.endTurn()}
                disabled={playerID !== currentPlayer}
            >
                End Turn
            </button>
        </div>
    </div>;
}

export default Board;


import { JSX } from "react";
import { useGameContext } from "../game-context";

function Board() : JSX.Element {
    const {
        G: {diceValues},
        ctx: {currentPlayer}, 
        playerData, 
        playerID,
        moves,
        events,
    } = useGameContext();
    

    const name = (id: string) => playerData[id].name;
    
    // Very crude board for now.
    return <div>
        {`Current player is ${name(currentPlayer)} (ID ${currentPlayer})`}
        {`Dice values: ${diceValues.join(", ")} `}

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
    </div>;
}

export default Board;


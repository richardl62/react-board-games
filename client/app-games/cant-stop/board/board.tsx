import { JSX } from "react";
import { useGameContext } from "../game-context";
import { Columns } from "./columns";
import { TurnControl } from "./turn-control";

function Board() : JSX.Element {
    const {
        ctx: {currentPlayer}, 
        playerData, 
    } = useGameContext();
    
    // Very crude board for now.
    return <div>
        <div>{`Current player: ${playerData[currentPlayer].name}`}</div>
        <Columns/>
        <TurnControl/>
    </div>
}

export default Board;


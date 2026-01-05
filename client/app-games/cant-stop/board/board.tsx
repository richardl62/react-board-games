import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { Columns } from "./columns";
import { TurnControl } from "./turn-control";
import { BlockedSquares } from "./blocked-squares";

function Board() : JSX.Element {
    const {
        ctx: {currentPlayer}, 
        playerData, 
    } = useMatchState();
    
    // Very crude board for now.
    return <div>
        <div>{`Current player: ${playerData[currentPlayer].name}`}</div>
        <BlockedSquares/>
        <Columns/>
        <TurnControl/>
    </div>
}

export default Board;


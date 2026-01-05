import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { Columns } from "./columns";
import { TurnControl } from "./turn-control";

function Board() : JSX.Element {
    const {
        G: {options},
        ctx: {currentPlayer}, 
        playerData, 
    } = useMatchState();
    
    // Very crude board for now.
    return <div>
        <div>{`Min clearance above: ${options.minClearanceAbove}`}</div>
        <div>{`Min clearance below: ${options.minClearanceBelow}`}</div>
        <div>{`Current player: ${playerData[currentPlayer].name}`}</div>
        <Columns/>
        <TurnControl/>
    </div>
}

export default Board;


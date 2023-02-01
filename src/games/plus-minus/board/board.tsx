import React from "react";
import { usePlusMinusContext } from "../client-side/plus-minus-context";

function Board() : JSX.Element {
    const context = usePlusMinusContext();
    const {G: {count}, moves, events, playerID, getPlayerName} = context;
    
    const current = context.ctx.currentPlayer === playerID;

    return <div>
        <div>{getPlayerName(playerID)}</div>
        
        <button 
            onClick={()=>moves.add(1)} 
            disabled={!current}>
            +1
        </button>

        <button 
            onClick={()=>moves.add(-1)} 
            disabled={!current}>
            -1
        </button>

        <button 
            onClick={() => events.endTurn()} 
            disabled={!current}>
            End Turn
        </button>
        
        <div>{count}</div>
    </div>;
}

export default Board;


import React from "react";
import { useBasicsContext } from "../client-side/basics-context";

export function GameArea() : JSX.Element {
    const context = useBasicsContext();
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


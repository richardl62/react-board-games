import React from "react";
import { useGameContext } from "../client-side/game-context";
import { SharedPiles } from "./shared-piles";

function Board() : JSX.Element {
    const context = useGameContext();
    const { events, playerID, getPlayerName} = context;
    
    const current = context.ctx.currentPlayer === playerID;

    return <div>
        <div>{getPlayerName(playerID)}</div>     

        <SharedPiles/>
        
        <button 
            onClick={() => events.endTurn()} 
            disabled={!current}>
            End Turn
        </button>        
    </div>;
}

export default Board;


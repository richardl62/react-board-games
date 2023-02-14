import React from "react";
import { useGameContext } from "../game-support/game-context";
import { Message } from "./message";
import { PlayerAreas } from "./player-areas";
import { SharedPiles } from "./shared-piles";

function Board() : JSX.Element {
    const { getPlayerName, ctx: {currentPlayer}} = useGameContext();
    
    return <div>
        <div>{getPlayerName(currentPlayer) + " to play"}</div>     

        <SharedPiles/>
        <PlayerAreas/>
        <Message/>        
    </div>;
}

export default Board;


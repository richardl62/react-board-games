import React from "react";
import styled from "styled-components";
import { standardOuterMargin } from "../../../app-game-support/styles";
import { useGameContext } from "../client-side/game-context";

const OuterDiv = styled.div`
    margin: ${standardOuterMargin};
`;

const Name = styled.span<{active: boolean}>`
    // underline if active
    text-decoration: ${props => props.active ? "underline" : "none"};
    margin-right: 1em;
`;

function PlayerNames() : JSX.Element {
    const {ctx: {playOrder}, playerID, getPlayerName} =  useGameContext();
    return <div>
        {playOrder.map((id) => 
            <Name key={id} active={id === playerID}>
                {getPlayerName(id)}
            </Name>
        )}
    </div>; 
}

function Board() : JSX.Element {
    const context = useGameContext();
    const {G: {count}, moves, events, playerID} = context;
    
    const current = context.ctx.currentPlayer === playerID;

    return <OuterDiv>
        <PlayerNames/>

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
    </OuterDiv>;
}

export default Board;


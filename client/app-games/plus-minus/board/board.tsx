import { JSX } from "react";
import styled from "styled-components";
import { standardOuterMargin } from "../../../app-game-support/styles";
import { useMatchState } from "../match-state";

const OuterDiv = styled.div`
    margin: ${standardOuterMargin};
`;

const Name = styled.span`
    margin-right: 1em;
`;

const CurrentPlayer = styled.div`
    margin-top: 0.7em;
    margin-bottom: 0.3em;
`;

function PlayerNames() : JSX.Element {
    const {ctx: {playOrder, currentPlayer}, getPlayerName} =  useMatchState();
    
    const name = (id: string) => {
        return getPlayerName(id) + (id === currentPlayer ? " (you)" : "");
    }
    return <div>
        {playOrder.map((id) => 
            <Name key={id} > {name(id)} </Name>
        )}
    </div>; 
}

function Board() : JSX.Element {
    const context = useMatchState();
    const {G: {count}, moves, events, playerID, getPlayerName} = context;
    
    const current = context.ctx.currentPlayer === playerID;
    const currentPlayerName = current ? "You" : getPlayerName(context.ctx.currentPlayer);
    return <OuterDiv>
        <PlayerNames/>
        
        <CurrentPlayer>Current player: {currentPlayerName}</CurrentPlayer>

        <button onClick={()=>moves.add(1)} >
            +1
        </button>

        <button onClick={()=>moves.add(-1)} >
            -1
        </button>

        <button onClick={() => events.endTurn()} >
            End Turn
        </button>
        
        <div>{count}</div>
    </OuterDiv>;
}

export default Board;


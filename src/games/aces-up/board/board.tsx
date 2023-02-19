import React from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { SharedArea } from "./shared-area";
import { PlayerAreas } from "./player-areas";
import { numPlayersOnScreen } from "../../../app/url-params";
import { useGameContext } from "../game-support/game-context";
import { GameWarnings } from "../../../app-game-support";

const OuterDivSinglePlayer = styled.div`
    /* Make sure that the whole div is at least as big as the window.
       This ensured that background-color applies to the whole window */
    width: 100%;
    min-height: 100vh;

    background-color: green;
    
    /* KLUDGE: This removes a several-pixel wide white marging at the
    top and bottom of the window. I am not sure why the margin was 
    there. */
    border: 1px green solid;

    color: white;
    font-size: 18px;
  
    font-family: Helvetica;
`;

const OuterDivMultiplePlayers = styled.div`
    width: 100%;
   
    background-color: green;
    color: white;
    font-size: 18px;
  
    font-family: Helvetica;
`;

const GameDiv = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${rowGap.betweenAreas};
    margin: 2%;
`;

function Board() : JSX.Element {
    const ctx = useGameContext();
    const OuterDiv = numPlayersOnScreen() === 1 ? OuterDivSinglePlayer :
        OuterDivMultiplePlayers;
        
    return <OuterDiv>
        <GameWarnings {...ctx}/>
        <GameDiv>
            <SharedArea/>
            <PlayerAreas />
        </GameDiv>
    </OuterDiv>;
}

export default Board;


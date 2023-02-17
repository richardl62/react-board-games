import React from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { SharedArea } from "./shared-area";
import { PlayerAreas } from "./player-areas";
import { numPlayersOnScreen } from "../../../app/url-params";
import { useGameContext } from "../game-support/game-context";
import { GameWarnings } from "../../../app-game-support";

const OuterDivSinglePlayer = styled.div`
  /* Make the div full screen */
  position:absolute;
  top:0px;
  right:0px;
  bottom:0px;
  left:0px;

  background-color: green;
  color: white;
  font-size: 18px;
  
  font-family: Helvetica;
`;

const OuterDivMultiplePlayers = styled.div`
  /* Make the div full screen */
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


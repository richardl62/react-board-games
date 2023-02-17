import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { ConfirmPenaltyCard } from "./confirm-penalty-card";
import { PlayerAreas } from "./player-areas";
import { SharedPiles } from "./shared-piles";

const OuterDiv = styled.div`
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

const GameDiv = styled.div`
    margin: 2%;
`;

function Board() : JSX.Element {
    const { getPlayerName, ctx: {currentPlayer}} = useGameContext();
    
    return <OuterDiv>
        <GameDiv>
            <div>{getPlayerName(currentPlayer) + " to play"}</div>

            <ConfirmPenaltyCard />
            <SharedPiles />
            <PlayerAreas />
        </GameDiv>
    </OuterDiv>;
}

export default Board;


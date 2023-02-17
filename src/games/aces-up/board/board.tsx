import React from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { SharedArea } from "./shared-area";
import { PlayerAreas } from "./player-areas";

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
    display: flex;
    flex-direction: column;
    row-gap: ${rowGap.betweenAreas};
    margin: 2%;
`;

function Board() : JSX.Element {
    return <OuterDiv>
        <GameDiv>
            <SharedArea/>
            <PlayerAreas />
        </GameDiv>
    </OuterDiv>;
}

export default Board;


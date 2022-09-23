import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { AddingCardsToBox as PuttingCardsIntoBox } from "./adding-cards-to-box";
import { WrappedScoreBoard } from "./wrapped-score-board";


const GameAreaDiv = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }
`;

export function GameArea() : JSX.Element {

    return <GameAreaDiv>
        <CutCard/>

        <PuttingCardsIntoBox/>
          
        <WrappedScoreBoard/>
        
    </GameAreaDiv>;
}


import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../cribbage-context";
import { CutCard } from "./cut-card";
import { Scores } from "./scores";
import { AddingCardsToBox as PuttingCardsIntoBox } from "./adding-cards-to-box";
import { Pegging } from "./pegging";
import { ScoringHands } from "./scoring-hands";


const GameArea = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }
`;

export function Cribbage() : JSX.Element {
    const context = useCribbageContext();

    return <GameArea>
        <CutCard/>

        {context.addingCardsToBox && <PuttingCardsIntoBox/>}
        {context.pegging && <Pegging/>}
        {context.scoringHands && <ScoringHands/>}
          
        <Scores/>
        
    </GameArea>;
}


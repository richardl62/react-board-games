import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";
import { CutCard } from "./cut-card";
import { AddingCardsToBox as PuttingCardsIntoBox } from "./adding-cards-to-box";
import { Pegging } from "./pegging";
import { ScoringHands } from "./scoring-hands";
import { SimpleClickScoreBoard } from "./score-board/simple-click-score-board";


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
          
        <SimpleClickScoreBoard/>
        
    </GameArea>;
}


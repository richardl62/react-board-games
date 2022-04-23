import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { gridCheck } from "../client-side-actions/grid-check";
import { ScoreCard as ScoreCardType, scoreCategories } from "../server-side/score-categories";
import { GameStage } from "../server-side/server-data";
import { ScoreCard } from "./score-card";

const ScoringDiv = styled.div`
    display: flex;
    font-size:large;
    margin-bottom: 6px;
`;

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerToScore, playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;
  
    if(stage !== GameStage.scoring) {
        return null;
    }

    sAssert(playerToScore);
    
    const name = getPlayerName(playerToScore);
    const { scoreCard, grid } = playerData[playerToScore];

    sAssert(grid, "Unexpected null grid");

    const scoreOptions: ScoreCardType = {};
    for(const category of scoreCategories) {
        const possibleScore = gridCheck[category](grid);
        if(possibleScore !== false) {
            scoreOptions[category] = possibleScore;
        }
    }

    return <ScoringDiv>
        <ScoreCard name={name} scoreCard={scoreCard} scoreOptions={scoreOptions} />
    </ScoringDiv>;
}
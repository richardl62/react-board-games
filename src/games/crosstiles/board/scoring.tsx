import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { countBonusLetters } from "../client-side/check-grid/count-bonus-letters";
import { bonusScore, Letter } from "../config";
import { displayName, ScoreCategory } from "../score-categories";
import { ScoreCard } from "../server-side/score-card";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
import { TileGrid } from "./tile-grid";

const ScoringDiv = styled.div`
    display: flex;  
    > * {
        margin-right: 1em;
    }
`;

const Header = styled.div`
    font-weight: bold;    
`;


interface ConfirmedScoreProps {
    scoreCard: ScoreCard;
    grid: (Letter | null)[][];
    chosenCategory: ScoreCategory;
}

function ConfirmedScore(props: ConfirmedScoreProps) {
    const {scoreCard, grid, chosenCategory} = props;
    const categoryName = displayName[chosenCategory];
    const score = scoreCard[chosenCategory];

    let text = `${score} points for ${categoryName}`;
    if(score === 0) {
        const bonus = countBonusLetters(grid) * bonusScore;
        if(bonus > 0) {
            text += `and ${bonus} bonus`;
        }
    }
        
    return <div>{text}</div>;
}

interface CompletedGridProps {
    pid: string;
}

function CompletedGrid({pid}: CompletedGridProps) {
    const context = useCrossTilesContext();
    const { playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;

    const name = getPlayerName(pid);
    const { scoreCard, grid } = playerData[pid];
    sAssert(grid, "Unexpected null grid");

    const chosenCategory = playerData[pid].chosenCategory;
    
    return <div>
        <Header>{name}</Header>
        <TileGrid letters={grid} />
        {chosenCategory ?
            <ConfirmedScore grid={grid} scoreCard={scoreCard} chosenCategory={chosenCategory} /> 
            :
            <>
                <GridStatus grid={grid} scoreCard={scoreCard} requestConfirmation />
            </>    
        }   

    </div>;
}

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData } = context;
    if(stage !== GameStage.scoring) {
        return null;
    }

    return <ScoringDiv>
        {Object.keys(playerData).map(pid => <CompletedGrid key={pid} pid={pid} />)}
    </ScoringDiv>;
}


import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { CrossTilesContext, useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { bonusScore } from "../config";
import { ClientMoves } from "../server-side/moves";
import { scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { GameStage } from "../server-side/server-data";
import { CategoryLabel, ColumnHeader, KnownScore, OptionalScore, TotalLabel } from "./score-card-elements";
import { scoreCardBoarderColor, scoreCardBoarderSize } from "./style";

type SetScoreArg = Parameters<ClientMoves["setScore"]>[0];
const ScoreCardsDiv = styled.div<{nPlayers: number}>`
    display: grid;
    grid-template-columns: repeat(${props => props.nPlayers+1},auto);
    
    background-color: ${scoreCardBoarderColor};
    grid-gap: ${scoreCardBoarderSize.internal};
    padding: ${scoreCardBoarderSize.internal};

    margin-top: 4px;
`;

function totalPlayerScore(pid: string, context: CrossTilesContext) {
    const { scoreCard } = context.playerData[pid];

    let total = 0;
    for (const category of scoreCategories) {
        const value = scoreCard[category];
        if (value !== undefined) {
            total += value;
        }
    }

    return total;
}

export function ScoreCards(): JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData,  wrappedGameProps } = context;
    const { playerID, getPlayerName, moves } = wrappedGameProps;

    if (stage === GameStage.settingOptions) {
        return null;
    }

    // Can be very inefficient.
    const scoreOption = (pid: string, category: ScoreCategory) : SetScoreArg | null => {
        if(stage !== GameStage.scoring || pid !== playerID || playerData[pid].chosenCategory) {
            return null;
        }

        const { scoreCard } = context.playerData[pid];
        if (scoreCard[category] !== undefined) {
            return null;
        }

        const grid = playerData[pid].grid;
        sAssert(grid);
        const {scoreOptions, nBonuses} = checkGrid(scoreCard, grid, context.isLegalWord);

        // If there are no scoring options, all categories that have not don't already have a
        // a score can given a 0 option. KLUDGE: Correct behaviour relies on 'bomus' being initialisedf
        // to 0.
        if (!scoreOptions) {
            return {category, score:0, bonus: 0};
        }

        const score = scoreOptions[category];
        if(score) {
            return {category, score, bonus: nBonuses * bonusScore};
        }

        return null;
    };
    
    const elems : JSX.Element[] = [];

    elems.push(<ColumnHeader key="blank-header"/>);
    for (const pid in playerData) {
        elems.push(<ColumnHeader key={pid}>{getPlayerName(pid)}</ColumnHeader>);
    }

    for(const category of scoreCategories) {
        elems.push(<CategoryLabel key={category} category={category}/>);
        for (const pid in playerData) {
            const key = category+pid;
            const optionalScore = scoreOption(pid, category);
            if(optionalScore !== null) {
                const action = () => moves.setScore(optionalScore);
                elems.push(<OptionalScore key={key} score={optionalScore.score} action={action}/>); 
            } else {
                const {scoreCard, chosenCategory} = context.playerData[pid];
                elems.push(<KnownScore key={key} 
                    recentlyChosen={chosenCategory === category}
                >
                    {scoreCard[category]}
                </KnownScore>);
            } 
        }
    }

    elems.push(<TotalLabel key={"totalLabel"}/>);
    for (const pid in playerData) {
        const score = totalPlayerScore(pid, context);
        elems.push(<KnownScore key={"total"+pid}>{score}</KnownScore>);
    }

    const nPlayers=Object.keys(playerData).length;
    return <ScoreCardsDiv nPlayers={nPlayers}>{elems}</ScoreCardsDiv>;
}
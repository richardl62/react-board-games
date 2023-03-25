import React from "react";
import styled from "styled-components";
import { CrossTilesContext, useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { ScoreOptions } from "../client-side/check-grid/score-options";
import { scoreCategories, ScoreCategory } from "../score-categories";
import { GameStage } from "../server-side/server-data";
import { CategoryLabel } from "./category-label";
import { ColumnHeader, KnownScore, OptionalScore } from "./score-card-elements";
import { scoreCardBoarderColor, scoreCardBoarderSize } from "./style";

const ScoreCardsDiv = styled.div<{nPlayers: number}>`
    display: inline-grid;
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
    const { stage, playerData, nPlayers, nthPlayerID, wrappedGameProps,
        isLegalWord } = context;
    const { getPlayerName, playerID, moves } = wrappedGameProps;

    if (stage === GameStage.starting) {
        return null;
    }

    const scoreOptions = (stage === GameStage.scoring) ?
        new ScoreOptions(playerData, isLegalWord) : null;
    

    const scoreAndABonus = (pid: string, category: ScoreCategory) => {
        let score : number | null = null;
        let bonus = 0;
        if(scoreOptions && !playerData[pid].chosenCategory) {
            score = scoreOptions.scoreOption(pid, category);
            bonus = scoreOptions.bonus(pid);
        }

        return {score, bonus};
    };

    const elems : JSX.Element[] = [];

    elems.push(<ColumnHeader key="blank-header"/>);
    for (let i = 0; i < nPlayers; ++i) {
        const pid = nthPlayerID(i);
        elems.push(<ColumnHeader key={pid}>{getPlayerName(pid)}</ColumnHeader>);
    }

    for(const category of scoreCategories) {
        elems.push(<CategoryLabel key={category} category={category}/>);
        for (let i = 0; i < nPlayers; ++i) {
            const pid = nthPlayerID(i);
            const key = category+pid;
            const {score, bonus}  = scoreAndABonus(pid, category);
            if(score !== null) {
                const action =  pid === playerID ?
                    () => moves.setScore({score, category, bonus}) : undefined;
                elems.push(
                    <OptionalScore key={key} onClick={action}>{score} </OptionalScore>
                ); 
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

    elems.push(<CategoryLabel key={"totalLabel"} category={"total"} />);
    for (let i = 0; i < nPlayers; ++i) {
        const pid = nthPlayerID(i);
        const score = totalPlayerScore(pid, context);
        elems.push(<KnownScore key={"total"+pid}>{score}</KnownScore>);
    }

    return <ScoreCardsDiv nPlayers={nPlayers}>{elems}</ScoreCardsDiv>;
}

import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { CrossTilesContext, useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { scoreOptions } from "../client-side/check-grid/score-options";
import { scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { GameStage } from "../server-side/server-data";
import { CategoryLabel, ColumnHeader, KnownScore, OptionalScore, TotalLabel } from "./score-card-elements";
import { scoreCardBoarderColor, scoreCardBoarderSize } from "./style";


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

export function ScoreCards(): JSX.Element {
    const context = useCrossTilesContext();
    const { stage, playerData,  wrappedGameProps } = context;
    const { getPlayerName } = wrappedGameProps;


    // Can be very inefficient.
    const scoreOption = (pid: string, category: ScoreCategory) : number | null => {
        if(stage !== GameStage.scoring) {
            return null;
        }

        const { scoreCard } = context.playerData[pid];
        if (scoreCard[category] !== undefined) {
            return null;
        }

        const grid = playerData[pid].grid;
        sAssert(grid);
        const options = scoreOptions(scoreCard, grid);

        // If there are no scoring options, all categories that have not don't already have a
        // a score can given a 0 option. KLUDGE: Correct behaviour relies on 'bomus' being initialisedf
        // to 0.
        if (!options) {
            return 0;
        }

        return options[category] || null;
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                const action = () => {};
                elems.push(<OptionalScore key={key} score={optionalScore} action={action}/>); 
            } else {
                const score = context.playerData[pid].scoreCard[category];
                elems.push(<KnownScore key={key}>{score}</KnownScore>);
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
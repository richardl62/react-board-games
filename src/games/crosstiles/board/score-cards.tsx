import React from "react";
import styled from "styled-components";
import { CrossTilesContext, useCrossTilesContext } from "../client-side/actions/cross-tiles-context";

import { displayName, scoreCategories, ScoreCategory } from "../server-side/score-categories";
import { scoreCardBackgroundColor, scoreCardBoarderColor, scoreCardBoarderSize } from "./style";


const ScoreCardsDiv = styled.div<{nPlayers: number}>`
    display: grid;
    grid-template-columns: repeat(${props => props.nPlayers+1},auto);
    
    background-color: ${scoreCardBoarderColor};
    grid-gap: ${scoreCardBoarderSize.internal};
    padding: ${scoreCardBoarderSize.internal};

    margin-top: 4px;
`;

const ScoreElementDiv = styled.div`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
`;

const ColumnHeader = styled.div<{activePlayer?: boolean}>`
    background-color: ${scoreCardBoarderColor};
    color: white; //Kludge - not defined in styles.ts
    padding: 1px;  // Kludge - copied from ScoreElement
    font-weight: bold;
    text-align: center;

    text-decoration: ${props => props.activePlayer ? "underline" : "none"};
`;

interface CategoryLabelProps {
    category: ScoreCategory;
}
function CategoryLabel({category}: CategoryLabelProps) {
    return <ScoreElementDiv> {/* KLUDGE */}
        {displayName[category]}
    </ScoreElementDiv>;
}

function TotalLabel() {
    return <ScoreElementDiv key={"total"}>
        TOTAL
    </ScoreElementDiv>;
}

interface ScoreElementsProps {
    score: number | undefined;
}
function ScoreElement({score}: ScoreElementsProps) {
    return <ScoreElementDiv>
        {score}
    </ScoreElementDiv>;
}


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
    const { playerData, wrappedGameProps: { getPlayerName } } = context;

    const scoreCard = (pid: string) =>
        context.playerData[pid].scoreCard;
    
    const elems : JSX.Element[] = [];

    elems.push(<ColumnHeader key="black-header"/>);
    for (const pid in playerData) {
        elems.push(<ColumnHeader key={pid}>{getPlayerName(pid)}</ColumnHeader>);
    }

    for(const category of scoreCategories) {
        elems.push(<CategoryLabel key={category} category={category}/>);
        for (const pid in playerData) {
            elems.push(<ScoreElement key={category+pid} score={scoreCard(pid)[category]} />); 
        }
    }

    elems.push(<TotalLabel key={"totalLabel"}/>);
    for (const pid in playerData) {
        const score = totalPlayerScore(pid, context);
        elems.push(<ScoreElement key={"total"+pid} score={score} />);
    }

    const nPlayers=Object.keys(playerData).length;
    return <ScoreCardsDiv nPlayers={nPlayers}>{elems}</ScoreCardsDiv>;
}
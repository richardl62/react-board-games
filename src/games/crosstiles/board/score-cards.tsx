import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { displayName, scoreCategories } from "../server-side/score-categories";
import { ScoreCard } from "../server-side/score-card";
import { scoreCardBackgroundColor, scoreCardBoarderColor, scoreCardBoarderSize } from "./style";


const ScoreCardsDiv = styled.div<{nPlayers: number}>`
    display: grid;
    grid-template-columns: repeat(${props => props.nPlayers+1},auto);
    
    background-color: ${scoreCardBoarderColor};
    grid-gap: ${scoreCardBoarderSize.internal};
    padding: ${scoreCardBoarderSize.internal};

    margin-top: 4px;
`;

const ScoreElement = styled.div`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
`;

const ColumnHeader = styled.div`
    background-color: ${scoreCardBoarderColor};
    color: white; //Kludge - not defined in styles.ts
    padding: 1px;  // Kludge - copied from ScoreElement
    font-weight: bold;
    text-align: center;
`;

function totalScore(scoreCard: ScoreCard): number {
    let total = 0;
    for(const category of scoreCategories)  {
        const value = scoreCard[category];
        if(value !== undefined) {
            total += value;
        }
    }

    return total;
}

export function ScoreCards(): JSX.Element {
    const { playerData, wrappedGameProps: { getPlayerName } } = useCrossTilesContext();
    const elems : JSX.Element[] = [];

    const addElem = (data?: string|number, options?: {isColumnHeader: true}) => {
        const Wrapper = options?.isColumnHeader ? ColumnHeader : ScoreElement;
        return elems.push(<Wrapper key={elems.length}>{data}</Wrapper>);
    };

    addElem("", {isColumnHeader: true});
    for (const id in playerData) {
        addElem(getPlayerName(id), {isColumnHeader: true});
    }

    for(const category of scoreCategories) {
        addElem(displayName[category]);
        for (const id in playerData) {
            addElem(playerData[id].scoreCard[category]);
        }
    }

    addElem("TOTAL");
    for (const id in playerData) {
        addElem(totalScore(playerData[id].scoreCard));
    }

    const nPlayers=Object.keys(playerData).length;
    return <ScoreCardsDiv nPlayers={nPlayers}>{elems}</ScoreCardsDiv>;
}



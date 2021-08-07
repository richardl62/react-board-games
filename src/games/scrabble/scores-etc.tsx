import React from "react";
import styled from "styled-components";
import { GameWarnings } from "../../game-support/show-warning";
import { sAssert } from "../../shared/assert";
import { ScrabbleData } from "./scrabble-data";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? 'underline' : 'none'};
`;

// To do: Think of a better name
export function ScoresEtc({scrabbleData}: {scrabbleData: ScrabbleData}) {


    let scoreElems = scrabbleData.playOrder.map(playerID => {
        const generalPd = scrabbleData.playerData[playerID];
        const scrabblePd = scrabbleData.rackEtc[playerID];
        sAssert(generalPd && scrabblePd);

        const name = generalPd.name;
        const score = scrabblePd.score;
        const isYou = playerID === scrabbleData.playerID;

        const current = playerID === scrabbleData.currentPlayer;

        let displayName = name;
        if (isYou) {
            displayName += " (you)"
        }
        return (
            <PlayerScore key={name} current={current} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings scrabbleData={scrabbleData}/>
        </div>
    )
}
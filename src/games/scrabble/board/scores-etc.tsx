import React from "react";
import styled from "styled-components";
import { GameWarnings } from "game-support/show-warning";
import { ScrabbleData } from "../game-control";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? "underline" : "none"};
`;

// To do: Think of a better name
export function ScoresEtc({scrabbleData}: {scrabbleData: ScrabbleData}): JSX.Element {


    const scoreElems = scrabbleData.playOrder.map(pid => {
        const score = scrabbleData.score(pid);
        const name = scrabbleData.name(pid);

        let displayName = name;
        if (pid === scrabbleData.playerID) {
            displayName += " (you)";
        }
        return (
            <PlayerScore key={name} current={pid === scrabbleData.currentPlayer} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...scrabbleData.getProps()}/>
        </div>
    );
}
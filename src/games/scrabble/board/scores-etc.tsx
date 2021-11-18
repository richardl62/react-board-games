import React from "react";
import styled from "styled-components";
import { GameWarnings } from "game-support/show-warning";
import { GameProps } from "./game-props";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? "underline" : "none"};
`;

// To do: Think of a better name
export function ScoresEtc({xxx}: {xxx: GameProps}): JSX.Element {


    const scoreElems = xxx.bgioProps.playOrder.map(pid => {
        const name = xxx.bgioProps.name(pid);

        const score = xxx.localState.playerData[pid].score;

        let displayName = name;
        if (pid === xxx.bgioProps.playerID) {
            displayName += " (you)";
        }
        return (
            <PlayerScore key={name} current={pid === xxx.bgioProps.currentPlayer} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...xxx.bgioProps}/>
        </div>
    );
}
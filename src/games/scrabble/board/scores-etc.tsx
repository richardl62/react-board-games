import React from "react";
import styled from "styled-components";
import { GameWarnings } from "game-support/show-warning";
import { Actions } from "../actions";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? "underline" : "none"};
`;

// To do: Think of a better name
export function ScoresEtc({actions}: {actions: Actions}): JSX.Element {


    const scoreElems = actions.bgioProps.playOrder.map(pid => {
        const name = actions.bgioProps.name(pid);

        const score = actions.localState.playerData[pid].score;

        let displayName = name;
        if (pid === actions.bgioProps.playerID) {
            displayName += " (you)";
        }
        return (
            <PlayerScore key={name} current={pid === actions.bgioProps.currentPlayer} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...actions.bgioProps}/>
        </div>
    );
}
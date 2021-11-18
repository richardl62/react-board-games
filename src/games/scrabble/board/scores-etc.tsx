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
export function ScoresEtc(props: GameProps): JSX.Element {


    const scoreElems = props.bgioProps.playOrder.map(pid => {
        const name = props.bgioProps.name(pid);

        const score = props.playerData[pid].score;

        let displayName = name;
        if (pid === props.bgioProps.playerID) {
            displayName += " (you)";
        }
        return (
            <PlayerScore key={name} current={pid === props.bgioProps.currentPlayer} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...props.bgioProps}/>
        </div>
    );
}
import React from "react";
import styled from "styled-components";
import { GameWarnings } from "../../game-support/show-warning";
import { BoardProps } from "../../shared/types";
import { GameData } from "./game-data";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? 'underline' : 'none'};
`;

// To do: Think of a better name
export function ScoresEtc(props : BoardProps<GameData>) {
    const generalPd = props.playerData;
    const scrabblePd = props.G.playerData;
    const nPlayers = generalPd.length;

    let scoreElems = [];
    for(let index = 0; index < nPlayers; ++index) {
        const name = generalPd[index].name;
        const isYou = generalPd[index].id === props.playerID;
        const score = scrabblePd[index].score;
        const id = index.toString(); // KLUDGE
        const current = id === props.ctx.currentPlayer;

        let displayName = name;
        if(isYou) {
            displayName += " (you)"
        }
        scoreElems.push(
            <PlayerScore key={name} current={current} >
                {`${displayName}: ${score}`}
            </PlayerScore>
        )
    }

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...props} />
        </div>
    )
}
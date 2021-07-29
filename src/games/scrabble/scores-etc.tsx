import React from "react";
import styled from "styled-components";
import { getPlayerData } from "../../game-support";
import { GameWarnings } from "../../game-support/show-warning";
import assert from "../../shared/assert";
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
    const generalPd = getPlayerData(props);
    const scrabblePd = props.G.playerData;
    assert(generalPd.length === scrabblePd.length);
    const nPlayers = generalPd.length;

    let scoreElems = [];
    for(let index = 0; index < nPlayers; ++index) {
        const name = generalPd[index].name;
        const score = scrabblePd[index].score;
        const current = index === props.G.currentPlayer;
        scoreElems.push(
            <PlayerScore key={name} current={current} >
                {`${name}: ${score}`}
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
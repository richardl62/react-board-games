import React from "react";
import styled from "styled-components";
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


    let scoreElems = props.ctx.playOrder.map(playerID => {
        const generalPd = props.playerData[playerID];
        const scrabblePd = props.G.playerData[playerID];
        assert(generalPd && scrabblePd);

        const name = generalPd.name;
        const score = scrabblePd.score;
        const isYou = playerID === props.playerID;

        const current = playerID === props.ctx.currentPlayer;

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
            <GameWarnings {...props} />
        </div>
    )
}
import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";
import { PlayerID } from "../server-side/server-data";
import { PlayerProps, ScoreBoard } from "./score-board/score-board";
import { colors } from "./score-board/style";

const ScoreLine = styled.div<{color: string}>`
    color: ${props => props.color}
`;

export function WrappedScoreBoard() : JSX.Element {
    const context = useCribbageContext();

    const playerProps = (who: PlayerID) => {
        const {score, trailingPeg} = context[who];
        const props: PlayerProps = {
            hasPeg: val => val === score || val === trailingPeg,
            onClick: val => context.moves.pegClick({who, score: val}),
        };
        return props;
    }; 

    return <div>
        <ScoreBoard player1={playerProps(context.me)} player2={playerProps(context.pone)} />
        <ScoreLine color={colors.player1}>
            {`You: ${context[context.me].score}`}
        </ScoreLine>
        <ScoreLine color={colors.player2}>
            {`${context.poneName}: ${context[context.pone].score}`}
        </ScoreLine>
    </div>; 
}
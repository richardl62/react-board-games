import React from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { PlayerID } from "../server-side/server-data";
import { PlayerProps, ScoreBoard } from "./score-board/score-board";


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
        <div>{`You: ${context[context.me].score}`}</div>
        <div>{`Pone: ${context[context.pone].score}`}</div>
    </div>; 
}
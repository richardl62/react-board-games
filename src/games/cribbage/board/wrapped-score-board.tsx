import React from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { PlayerProps, ScoreBoard } from "./score-board/score-board";



export function WrappedScoreBoard() : JSX.Element {
    const context = useCribbageContext();

    const playerProps = (who: "me"| "pone") => {
        const {score, trailingPeg} = context[who];
        const props: PlayerProps = {
            hasPeg: val => val === score || val === trailingPeg,
            onClick: val => context.moves.pegClick({who, score: val}),
        };
        return props;
    }; 

    return <div>
        <ScoreBoard player1={playerProps("me")} player2={playerProps("pone")} />
        <div>{`Player1: ${context["me"].score}`}</div>
        <div>{`Player2: ${context["pone"].score}`}</div>
    </div>; 
}
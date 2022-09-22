import React from "react";
import { useState } from "react";
import { nPreStartPegs } from "./config";
import { ScoreBoard } from "./score-board";

type Pegs = [number,number];
function movePeg(pegs: Pegs, moveTo:number) : Pegs {
    // You can't move onto an existing peg.
    if(pegs.includes(moveTo)) {
        return pegs;
    }

    if (moveTo > pegs[1]) {
        // Standard move
        return [pegs[1], moveTo];
    } else if (moveTo > pegs[0]) {
        return [pegs[0], moveTo];
    } else {
        return [moveTo, pegs[0]];
    }
}

function usePlayerProps() {
    const [pegs, setPegs] = useState<Pegs>([0,1]);

 
    const playerProps = {
        hasPeg: (index: number) => pegs.includes(index),
        onClick: (index: number) => setPegs(movePeg(pegs, index)),
        score: Math.max(pegs[1] - (nPreStartPegs-1), 0)
    };

    return playerProps;
}

export function SimpleClickScoreBoard() : JSX.Element {
    const player1 = usePlayerProps();
    const player2 = usePlayerProps();

    return <div>
        <ScoreBoard player1={player1} player2={player2} />
        <div>{`Player1: ${player1.score}`}</div>
        <div>{`Player2: ${player2.score}`}</div>
    </div>; 
}
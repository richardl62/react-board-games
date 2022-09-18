import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { nPreStartPegs } from "./config";
import { MarkerLines } from "./marker-lines";
import { boardHeight, boardWidth, pegPoints } from "./peg-points";
import { boardPadding, holeRadius } from "./sizes";
import { Position } from "./types";


const Board = styled.div<{height: number, width: number}>`
    position: relative;

    height: ${props => props.height}px;
    width: ${props => props.width}px;


    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    background: brown;
    border: ${boardPadding}px solid brown;
`;

interface HoleProps {
    left: number;
    bottom: number;
 }

/*
Originally, Hole did not use attribs, and instead bottom and left were defined
along with the ohter properies (position, etc). But doing it that way lead to
a warnings like
    Over 200 classes were generated for component styled.div with the id of "sc-crXcEl".
    Consider using the attrs method ...
*/
const PegContainer = styled.div.attrs<
HoleProps, // What is consumed by .attrs()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {style: any} // What comes out of .attrs(). Use of 'any' is a kludge. 
>((props) => {
    return {style: {
        position: "absolute",
        bottom: props.bottom,
        left: props.left,
    }};
})<HoleProps>`

    height: ${holeRadius}px;
    width: ${holeRadius}px;
`;

const Hole = styled.div`
    height: ${holeRadius}px;
    width: ${holeRadius}px;
    border-radius: 50%;


    box-sizing: border-box;
    border: solid 2px black;
    background: cornsilk;
`;

const Peg = styled.div<{player1 : boolean}>`
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border: solid 1px black;
    border-radius: 50%;
    background: ${props => props.player1 ? "yellow" : "blue"};
`;

interface PlayerProps {
    /** Called to check if there is a peg in the hole */
    hasPeg: (index: number) => boolean;

    /** Called when a peg/hole is clicked */
    onClick: (index: number) => void;
}


function makeElements(pegPoints: Position[], props: PlayerProps, player1: boolean) {
    return pegPoints.map((pos, index) => {
        const key = `${index}-{player1}`;
        return <PegContainer key={key} bottom={pos.bottom} left={pos.left}
            onClick={()=>props.onClick(index)}
        >
            {props.hasPeg(index) ? <Peg player1={player1}/> : <Hole/>}
        </PegContainer>;
    });
}

interface ScoreBoardProps {
    player1: PlayerProps;
    player2: PlayerProps;
}

function ScoreBoard(props: ScoreBoardProps) {

    return <Board height={boardHeight} width={boardWidth}>
        {makeElements(pegPoints.player1,props.player1, true)}
        {makeElements(pegPoints.player2,props.player2, false)}
        <MarkerLines/>
    </Board>;
}

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

export function AvticeScoreBoard() : JSX.Element {
    const player1 = usePlayerProps();
    const player2 = usePlayerProps();

    return <div>
        <ScoreBoard player1={player1} player2={player2} />
        <div>{`Player1: ${player1.score}`}</div>
        <div>{`Player2: ${player2.score}`}</div>
    </div>; 
}
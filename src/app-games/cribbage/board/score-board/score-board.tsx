import { JSX } from "react";
import styled from "styled-components";
import { nPreStartPegs } from "../../config";
import { colors } from "./style";
import { MarkerLines } from "./marker-lines";
import { boardHeight, boardWidth, pegPoints } from "./peg-points";
import { boardPadding, holeRadius, pegSize, rowGap } from "./sizes";
import { Position } from "./types";

const Board = styled.div<{height: number, width: number}>`
    position: relative;

    height: ${props => props.height}px;
    width: ${props => props.width}px;

    box-sizing: content-box; //KLUDGE?
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    background: ${colors.board};
    border: ${boardPadding}px solid ${colors.board};
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
    HoleProps // What is consumed by .attrs() 
 >((props) => {
    return {style: {
        position: "absolute",
        bottom: props.bottom,
        left: props.left,
    }};
})<HoleProps>`

    height: ${rowGap.standard}px;
    width: ${rowGap.standard}px;
`;

const Hole = styled.div`
    height: ${holeRadius}px;
    width: ${holeRadius}px;
    border-radius: 50%;


    box-sizing: border-box;
    border: solid 2px ${colors.holeBorder};
    background: ${colors.holeBackground};
`;

const Peg = styled.div<{player1 : boolean}>`
    height: ${pegSize}px;
    width: ${pegSize}px;
    box-sizing: border-box;
    border: solid 1px ${colors.holeBorder};
    border-radius: 50%;
    background: ${props => props.player1 ? colors.player1 : colors.player2};
`;


function makeElements(pegPoints: Position[], props: PlayerProps, player1: boolean) {

    return pegPoints.map((pos, index) => {
        // offSet to convert an index into a score.
        const scoreOffset = nPreStartPegs - 1;

        const hasPeg = props.hasPeg(index - scoreOffset);
        const onClick = ()=>props.onClick(index - scoreOffset);

        const key = `${index}-{player1}`;
        return <PegContainer key={key} bottom={pos.bottom} left={pos.left}
            onClick={onClick}
        >
            {hasPeg ? <Peg player1={player1}/> : <Hole/>}
        </PegContainer>;
    });
}

export interface PlayerProps {
    /** Called to check if there is a peg in the hole 
    A score of 0 or less implies a pre-peg hole
    */
    hasPeg: (score: number) => boolean;

    /** Called when a peg/hole is clicked 
     * See hasPeg for further comments.
    */
    onClick: (score: number) => void;
}

interface ScoreBoardProps {
    player1: PlayerProps;
    player2: PlayerProps;
}

export function ScoreBoard(props: ScoreBoardProps) : JSX.Element {

    return <Board height={boardHeight} width={boardWidth}>
        {makeElements(pegPoints.player1,props.player1, true)}
        {makeElements(pegPoints.player2,props.player2, false)}
        <MarkerLines/>
    </Board>;
}


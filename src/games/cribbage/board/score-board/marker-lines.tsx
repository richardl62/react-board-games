import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../../utils/assert";
import { nPreStartPegs, skunkLinePos, winningLinePos } from "../../config";
import { pegPoints } from "./peg-points";
import { columnGap, holeRadius, rowGap } from "./sizes";
import { Position } from "./types";

const markerLineLength = columnGap + holeRadius;
const markerLineThickness = 2;
const snunkFontSize = rowGap.standard;

function lineStart(indexAfter: number) {
    const pa = pegPoints.player1[indexAfter];
    const pb = pegPoints.player1[indexAfter-1];

    // check that some assumptions are true. (They might not be true it, say, the arcs
    // are in different places or the skunk line is moved). 
    sAssert(pa.left === pb.left);
    sAssert(pa.left < pegPoints.player2[indexAfter].left);

    return {
        bottom: (pa.bottom + pb.bottom)/2 + holeRadius/2 + 3, //KJLUDGE
        left: pa.left,
    };
}


const MarkerLine = styled.div<{start: Position, grey?: boolean}>`
    display: block;

    position: absolute;
    left: ${props => props.start.left}px;
    bottom: ${props => (props.start.bottom - markerLineThickness/2)}px;

    height: ${markerLineThickness}px;
    width: ${markerLineLength}px;
    background: ${props => (props.grey ? "grey" : "black")}
`;

const Snunk = styled.div<{start: Position}>`
    display: inline;

    position: absolute;
    left: ${props => props.start.left}px;
    bottom: ${props => props.start.bottom}px;

    font-size: ${snunkFontSize}px;
    font-weight: 900;
    font-family: "Times New Roman";
`;

export function MarkerLines() : JSX.Element {
    const snunkLineStart = lineStart(nPreStartPegs+skunkLinePos);

    // Kludge: -1 and -3 are judge factors.
    const snunkSStart = {
        bottom: snunkLineStart.bottom - snunkFontSize/2 - 1,
        left: snunkLineStart.left + markerLineLength/2 - 3,

    };
    return <div>
        <MarkerLine start={lineStart(nPreStartPegs)} />

        <MarkerLine start={snunkLineStart} grey />
        <Snunk start={snunkSStart}>S</Snunk>

        <MarkerLine start={lineStart(nPreStartPegs+winningLinePos)} />
    </div>;
}
import React from "react";
import styled from "styled-components";
import { sAssert } from "../assert";

const spotPositions = [
    null,
    [[0,0,0],[0,1,0],[0,0,0]], // 1
    [[1,0,0],[0,0,0],[0,0,1]], // 2
    [[1,0,0],[0,1,0],[0,0,1]], // 3
    [[1,0,1],[0,0,0],[1,0,1]], // 4
    [[1,0,1],[0,1,0],[1,0,1]], // 5
    [[1,0,1],[1,0,1],[1,0,1]], // 6 
];
const allSpots = [[1,0,1],[1,1,1],[1,0,1]];

const diceSize = 50; // px
const diceBorder = diceSize * 0.15; // px
const spotSize = diceSize * 0.16; // px

function spotOffset(index: number) {
    if(index === 0) {
        return diceBorder;
    }
    if(index === 1) {
        return diceSize / 2 - spotSize / 2;
    }
    if(index === 2) {
        return diceSize - spotSize - diceBorder;
    }
    sAssert(false);
}

const DiceDiv = styled.div<{rotation: number, color: string}>`
    position: relative;
    background-color: ${props => props.color};
    border-radius: 10px;

    height: ${diceSize}px;
    width: ${diceSize}px;

    transform: rotate(${props => props.rotation}deg);
`;

const Spot = styled.div<{row: number, col: number}>`
    position: absolute;
    top: ${props => spotOffset(props.row)}px;
    left: ${props => spotOffset(props.col)}px;

    height: ${spotSize}px;
    width: ${spotSize}px;
    border-radius: 50%;
    background-color: white;
`;

export function Dice({face, rotation, color}: {
    face: number | "allSpots", // allSpots is intended for use when the die is spinning.
    color: string, // For now at least, the spots are always white.
    rotation: number, // degrees 
}) {
    const spotPos = face === "allSpots" ? allSpots : spotPositions[face];
    sAssert(spotPos);

    const spots = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (spotPos[row][col]) {
                spots.push(<Spot row={row} col={col} key={row * 3 + col} />);
            }
        }
    }

    return <DiceDiv 
        rotation={rotation}
        color={color}
    >
        {spots}
    </DiceDiv>;
}
Dice.diceSize = diceSize;

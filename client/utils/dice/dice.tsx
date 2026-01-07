import styled from "styled-components";
import { sAssert } from "../assert.js";

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

export const diceSize = "50px";
const diceBorder = `calc(${diceSize} * 0.15)`;
const spotSize = `calc(${diceSize} * 0.16)`; // px

function spotOffset(index: number) {
    if(index === 0) {
        return diceBorder;
    }
    if(index === 1) {
        return `calc(${diceSize} / 2 - ${spotSize} / 2)`;
    }
    if(index === 2) {
        return `calc(${diceSize} - ${spotSize} - ${diceBorder})`;
    }
    sAssert(false);
}

const DiceDiv = styled.div<{rotation: number, color: string}>`
    position: relative;
    background-color: ${props => props.color};
    border-radius: 10px;

    height: ${diceSize};
    width: ${diceSize};

    transform: rotate(${props => props.rotation}deg);
`;

const Spot = styled.div<{row: number, col: number}>`
    position: absolute;
    top: ${props => spotOffset(props.row)};
    left: ${props => spotOffset(props.col)};
    height: ${spotSize};
    width: ${spotSize};
    border-radius: 50%;
    background-color: white;
`;

export function Dice({face, rotation, color}: {
    face: number, // Integer between 1 and 6.

    rotation?: number | null, // If a number is given the face value
        // is ignored and all spots are shown. This is intended to help simulate
        // a rotation.
        
    color: string, // For now at least, the spots are always white.
}) {
    const spotPos = typeof rotation === "number" ? allSpots : spotPositions[face];
    sAssert(spotPos, "Dice face value is invalid");

    const spots = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (spotPos[row][col]) {
                spots.push(<Spot row={row} col={col} key={row * 3 + col} />);
            }
        }
    }

    return <DiceDiv 
        rotation={rotation ?? 0}
        color={color}
    >
        {spots}
    </DiceDiv>;
}
Dice.diceSize = diceSize;

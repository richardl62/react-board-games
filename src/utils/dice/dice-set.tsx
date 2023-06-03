import React from "react";
import styled from "styled-components";
import { Dice } from "./dice";
import { sAssert } from "../assert";
import { HoldableDice } from "./holdable-dice";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: row;
    // gap between dice
    > * + * {
        margin-left: ${Dice.diceSize * 0.1}px;
    };
`;

export function DiceSet({faces, rotation, held, onDiceClick}: { 
    faces: number[];
    held: boolean[];

    // If non-null, any non-held dice are shown as rotated by this angle
    // (in degrees), and all 7 possible dice spots are shown.
    rotation?: number | null;

    onDiceClick?: (i: number) => void;
 }) {
    sAssert(held.length === faces.length);

    return (
        <OuterDiv>
            {faces.map((face, i) => (
                <HoldableDice 
                    rotation={rotation} 
                    face={face}
                    held={ held[i]}
                    onClick={onDiceClick && (() => onDiceClick(i))} 
                    key={i} 
                />
            ))}
        </OuterDiv>
    );
}



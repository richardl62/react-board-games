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

export function DiceSet({faces, rotation, held, setHeld}: { 
    faces: number[];
    // If set, and if the value has changed since the last render, the dice
    // will be shown spinning before the values are shown. (On the first render, the
    // condition is just that the value is set. )
    rotation?: number | null;

    held: boolean[];
    setHeld: (i: number, hold: boolean) => void;
 }) {
    sAssert(held.length === faces.length);

    return (
        <OuterDiv>
            {faces.map((face, i) => (
                <HoldableDice 
                    rotation={rotation} 
                    face={face}
                    held={ held[i]}
                    setHeld={(hold) => setHeld(i, hold)} 
                    key={i} 
                />
            ))}
        </OuterDiv>
    );
}



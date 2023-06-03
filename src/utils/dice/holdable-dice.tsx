import React from "react";
import { Dice } from "./dice";
import { diceColor } from "./style";
import styled from "styled-components";

// Text is centered justified.
const Held = styled.div<{ visible: boolean }>`
    visibility: ${props => props.visible ? "visible" : "hidden"};
    font-weight: bold;
    font-family: helvetica;
    color: ${diceColor.held};
    text-align: center;
`;

// A dice with a toggle-able hold.
// Intended just for use in DiceSet.
export function HoldableDice({ face, rotation, held, onClick }: {
    face: number;
    held: boolean;

    // Rotation is ignored if the dice is held. 
    rotation?: number | null;
    onClick?: () => void;
}) {

    if (held) {
        rotation = null; // KLUDGE?
    }

    return <div onClick={onClick}>
        <Dice
            rotation={rotation || 0}
            face={rotation === null ? face : "allSpots"}
            color={held ? diceColor.held : diceColor.unheld} 
        />
        <Held 
            visible={held}
        >
            Held
        </Held>
    </div>;
}

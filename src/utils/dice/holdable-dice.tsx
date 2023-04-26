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
export function HoldableDice({ face, rotation, held, setHeld }: {
    face: number;
    rotation: number | null; // If set, and the dice are not held, 
        // the dice will be show all 7 spots.
    held: boolean; // If set, the rotation is ignored.
    setHeld: (hold: boolean) => void;
}) {
    const onClick = () => setHeld && setHeld(!held);

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

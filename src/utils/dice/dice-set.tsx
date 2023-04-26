import React from "react";
import styled from "styled-components";
import { Dice } from "./dice";
import { useCountdown } from "../use-countdown";
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

// Returns the rotation of the dice, in degrees, or null if the dice are not
// spinning.
function useDiceRotation(
    // See comment in DiceSet.
    rollIfChanged?: number 
) : number | null {
    const spinTime = 1; // seconds
    const numberOfRotations = 1; // seconds
    const anglePerStep = 30; // degrees

    const numSteps = numberOfRotations * (360 / anglePerStep);
    const tickInterval = spinTime * 1000 / numSteps;

    const [spinning, setSpinning] = React.useState(false);
    const [prevRollIfChanged, setPrevRollIfChanged] = React.useState<number|undefined>();
    
    const { ellapsedTime, reset: resetSpinCountdown } = useCountdown({
        time: spinTime, 
        tickInterval: tickInterval,
        onEnd: () => spinning && setSpinning(false),
    });

    if (rollIfChanged !== prevRollIfChanged) {
        setPrevRollIfChanged(rollIfChanged);
        if (rollIfChanged !== undefined) {
            setSpinning(true);
            resetSpinCountdown();
        }
    }

    if (!spinning) {
        return null;
    }
    
    const timePerRotation = spinTime / numberOfRotations;
    const rotation = ((ellapsedTime / timePerRotation) * 360) % 360;

    // return rotation rounddd to the nearest anglePerStep. (This seems to give
    // better performance.)
    return Math.round(rotation / anglePerStep) * anglePerStep;
}

export function DiceSet({faces, rollIfChanged, held, setHeld}: { 
    faces: number[];
    // If set, and if the value has changed since the last render, the dice
    // will be shown spinning before the values are shown. (On the first render, the
    // condition is just that the value is set. )
    rollIfChanged?: number;

    held: boolean[];
    setHeld: (i: number, hold: boolean) => void;
 }) {
    sAssert(held.length === faces.length);

    const rotation = useDiceRotation(rollIfChanged);
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



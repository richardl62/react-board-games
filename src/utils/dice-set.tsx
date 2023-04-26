import React from "react";
import styled from "styled-components";
import { Dice } from "./dice";
import { useCountdown } from "./use-countdown";
import { sAssert } from "./assert";

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
    const timePerRotation = 0.2; // seconds

    const [spinning, setSpinning] = React.useState(false);
    const [prevRollIfChanged, setPrevRollIfChanged] = React.useState<number|undefined>();
    
    const { timeLeft, reset: resetSpinCountdown } = useCountdown({
        time: spinTime, 
        tickInterval: 100,
        onEnd: () => spinning && setSpinning(false),
    });

    if (rollIfChanged !== prevRollIfChanged) {
        setPrevRollIfChanged(rollIfChanged);
        if (rollIfChanged !== undefined) {
            setSpinning(true);
            resetSpinCountdown();
        }
    }

    return spinning ? ((spinTime - timeLeft) / timePerRotation) * 360 : null;
}

// A dice that can be held. Rotation is ignored if held is true.
function HoldableDice({face, rotation, held, setHeld}: {
    face: number;
    rotation: number | null;
    held?: boolean;
    setHeld?: (hold: boolean) => void;
}) {
    const onClick = () => setHeld && setHeld(!held);

    if(held) {
        rotation = null; // KLUDGE?
    }

    return <div onClick={onClick}>
        <Dice 
            rotation={rotation || 0} 
            face={rotation === null ? face : "allSpots"} 
        />
        <div>{held ? "held" : "not held"}</div>
    </div>;
}
export function DiceSet({faces, rollIfChanged, held, setHeld}: { 
    faces: number[];
    // If set, and if the value has changed since the last render, the dice
    // will be shown spinning before the values are shown. (On the first render, the
    // condition is just that the value is set. )
    rollIfChanged?: number;

    held?: boolean[];
    setHeld?: (i: number, hold: boolean) => void;
 }) {
    sAssert(!held || held.length === faces.length);
    sAssert((held === undefined) === (setHeld === undefined), 
        "both held and setHeld must be set or neither");

    const rotation = useDiceRotation(rollIfChanged);
    return (
        <OuterDiv>
            {faces.map((face, i) => (
                <HoldableDice 
                    rotation={rotation} 
                    face={face}
                    held={held && held[i]}
                    setHeld={setHeld && ((hold) => setHeld(i, hold))} 
                    key={i} 
                />
            ))}
        </OuterDiv>
    );
}



import React from "react";
import styled from "styled-components";
import { Dice } from "./dice";
import { useCountdown } from "./use-countdown";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: row;
    // gap between dice
    > * + * {
        margin-left: ${Dice.diceSize * 0.1}px;
    };
`;

function DiceSetHelper({faces, rotation}: { 
    faces: number[];
    // null means no rotation. 0 means rotating, but happens to be in
    // the original position.
    rotation: number | null; // number is in degrees
 }) {
    return (
        <OuterDiv>
            {faces.map((face, i) => (
                <Dice 
                    rotation={rotation || 0} 
                    face={rotation === null ? face : "allSpots"} 
                    key={i} 
                />
            ))}
        </OuterDiv>
    );
}

// A set of dice with an option to spin for a give number of seconds
export function DiceSet({faces}: {
    faces: number[];
}) {
    const [spinning, setSpinning] = React.useState(true);

    const spinTime = 2; // seconds
    const timePerRotation = 0.2; // seconds

    const { timeLeft } = useCountdown({
        time: spinTime, 
        tickInterval: 100,
        onEnd: () => spinning && setSpinning(false),
    });

    const rotation = spinning ? ((spinTime - timeLeft) / timePerRotation) * 360 : null;

    return <DiceSetHelper faces={faces} rotation={rotation}/>;
}


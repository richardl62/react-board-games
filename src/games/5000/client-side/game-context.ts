import { useState } from "react";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";
import { useTimedSteps } from "../../../utils/use-timed-steps";

const spinTime = 1000; // milliseconds
const nRotations = 1;
const stepSize = 30;


type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

interface GameContext extends TypedGameProps {
    diceRotation: number | null;
}

export function useGameContext() : GameContext {
    const from = 0;
    const to = nRotations * 360;
    const nSteps = (to - from) / stepSize;
    const stepTime = spinTime / nSteps;

    const [diceRotation, startRotation] = useTimedSteps({from, to, stepSize, stepTime});

    const gameProps = useStandardBoardContext() as TypedGameProps;
    const [ rollCoutdown, setRollCountdown ] = useState(gameProps.G.rollCount); 
    
    if(rollCoutdown !== gameProps.G.rollCount) {
        setRollCountdown(gameProps.G.rollCount);
        startRotation();
    }

    return { ...gameProps, diceRotation };
}


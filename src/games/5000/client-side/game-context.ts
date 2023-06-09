import { useState } from "react";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";
import { useTimedSteps } from "../../../utils/use-timed-steps";

const spinTime = 1000; // milliseconds
const nRotations = 1;
const stepSize = 30;

function diceRotationSteps() {
    const from = 0;
    const to = nRotations * 360;
    const nSteps = (to - from) / stepSize;
    const stepTime = spinTime / nSteps;

    return {from, to, stepSize, stepTime};
}   

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

interface GameContext extends TypedGameProps {
    diceRotation: {
        angle: number,
        // If true, all dice should be rollled. If false, only the
        // dice that were not held should be rolled.
        allDice: boolean,
    } | null;
    holdAllowed: boolean;
}

export function useGameContext() : GameContext {
    const gameProps = useStandardBoardContext() as TypedGameProps;
    const [ oldGameProps, setOldGameProps ] = useState(gameProps);
    const [ oldRollCount, setOldRollCount ] = useState(gameProps.G.rollCount);
    const [rotationAngle, startRotation] = useTimedSteps(diceRotationSteps());

    const { playerID } = gameProps;
    const { currentPlayer } = gameProps.ctx;
    const { turnOverRollCount, rollCount } = gameProps.G;

    // Start the dice roll if the roll count has changed
    let rolling = rotationAngle !== null;
    if(oldRollCount !== gameProps.G.rollCount) {
        setOldRollCount(gameProps.G.rollCount);
        startRotation();
        rolling = true;
    }

    // Record the old game props when not rolling. This ensures that
    // oldGameProps records the props that were in effect when the roll
    // started.
    if (!rolling && oldGameProps !== gameProps) {
        setOldGameProps(gameProps);
    }

    const returnedGameProps = rolling ? oldGameProps : gameProps;

    const diceRotation = rolling ? {
        angle: rotationAngle!,
        // If all dice were held, then assume this is a roll all.
        allDice: !oldGameProps.G.held.includes(false),
    } : null; 

    const turnOver = turnOverRollCount === rollCount;
    const holdAllowed = !turnOver && playerID === currentPlayer && diceRotation === null;
    return {...returnedGameProps, diceRotation, holdAllowed};
}


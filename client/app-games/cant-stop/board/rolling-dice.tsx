import { JSX, useEffect, useState } from "react";
import { useGameContext } from "../game-context";
import { Dice } from "@/utils/dice/dice";
import { sAssert } from "@shared/utils/assert";

const diceRoll = {
    duration: 1000, // milliseconds
    nRollSteps: 10, // steps
    rollTotalAngle: 360, // degrees
};

// eslint-disable-next-line react-refresh/only-export-components
export function useDiceRollStep() : number| null {
    const { G: {rollCount: serverRollCount} } = useGameContext();
    const [lastServerRollCount, setLastServerRollCount] = useState(serverRollCount);

    const [rollStep, setRollStep] = useState<number| null>(null);

    // Restart the rolling when a new roll is detected from the server.
    useEffect(() => {
        if (serverRollCount > lastServerRollCount) {
            setLastServerRollCount(serverRollCount);
            setRollStep(0);
        } 
    }, [serverRollCount, lastServerRollCount]);
   
    // Increment the roll step at appropriate intervals while a roll is in progress.
    useEffect(() => {
        if(rollStep !== null) {
            if (rollStep >= diceRoll.nRollSteps) {
                setRollStep(null); // Indicate that the roll has finished.
            } else {
                const timer = setTimeout(() => setRollStep(rollStep + 1), diceRoll.duration / diceRoll.nRollSteps);
                return () => clearTimeout(timer);
            }
        }
    }, [rollStep]);

    return rollStep;
}

export function RollingDice({value, rollStep, color} : {
    value: number,
    rollStep: number | null,
    color: string
}) : JSX.Element {
    sAssert(rollStep === null || (rollStep >= 0 && rollStep <= diceRoll.nRollSteps));   

    const face = rollStep === null ? value : "allSpots";
    const rotation = rollStep === null ? 0 : diceRoll.rollTotalAngle * (rollStep+1) / diceRoll.nRollSteps;

    return <Dice face={face} rotation={rotation ?? 0} color={color} />
}
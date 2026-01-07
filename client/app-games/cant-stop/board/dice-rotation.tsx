import { useEffect, useState } from "react";
import { useMatchState } from "../match-state/match-state";

const diceRoll = {
    duration: 500, // milliseconds
    nRollSteps: 5, // steps
    rollTotalAngle: 180, // degrees
};

export function useDiceRotation() : number| null {
    const { G: {rollCount: {total: totalRollCount}} } = useMatchState();
    const [lastTotalRollCount, setLastTotalRollCount] = useState(totalRollCount);

    const [rollStep, setRollStep] = useState<number| null>(null);

    // Restart the rolling when a new roll is detected from the server.
    useEffect(() => {
        if (totalRollCount > lastTotalRollCount) {
            setLastTotalRollCount(totalRollCount);
            setRollStep(0);
        } 
    }, [totalRollCount, lastTotalRollCount]);
   
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

    return rollStep === null ? null : diceRoll.rollTotalAngle * (rollStep + 1) / diceRoll.nRollSteps;
}
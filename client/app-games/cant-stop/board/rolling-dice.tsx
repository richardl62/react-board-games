import { useEffect, useState } from "react";
import { useMatchState } from "../match-state/match-state";

const diceRoll = {
    duration: 1000, // milliseconds
    nRollSteps: 10, // steps
    rollTotalAngle: 360, // degrees
};

export function useDiceRotation() : number| null {
    const { G: {rollCount: serverRollCount} } = useMatchState();
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

    return rollStep === null ? null : diceRoll.rollTotalAngle * (rollStep+1) / diceRoll.nRollSteps;
}
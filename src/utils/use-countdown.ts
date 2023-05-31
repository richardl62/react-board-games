// To do: Consider deleting this file and replaced usages with useTimedSteps.
import { useState, useEffect } from "react";
import { sAssert } from "./assert";

const defaultIntervalLength = 1000;

export function useNowTicker(
    /** interval in milliseconds.  Defaults to 1000. */
    optionalIntervalLenght?: number
) : number {
    
    const intervalLenght = optionalIntervalLenght === undefined ? 
        defaultIntervalLength : optionalIntervalLenght;
    sAssert(intervalLenght >= 0, "Bad interval length");
    
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, intervalLenght);

        return () => clearInterval(interval);
    });

    return now;
}


interface useTickerResult {
    /** Seconds since started or reset.  Can be fractional. 
     * Updated after (approximately) the given interval
     */
    ellapsedTime: number;
    stop: () => void;
    reset: () => void;
}

export function useTicker(
    intervalLenght?: number, // milliseconds, defaults to 1000 (i.e 1 second)
) : useTickerResult {

    sAssert(intervalLenght === undefined || intervalLenght >= 0, "Bad interval length");
        
    const [start, setStart] = useState(Date.now());
    const [now, setNow] = useState(Date.now());
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (active) {
            const interval = setInterval(() => {
                setNow(Date.now());
            }, intervalLenght);
            
            return () => clearInterval(interval);
        }
    });

    return {
        ellapsedTime: (now - start) / 1000, 
        /** I thought that the 'active &&' was unneccessary. But react seemed to trigger 
         * an update even when state was already false */
        stop : () => active && setActive(false),
        reset: () => {
            setStart(Date.now());
            setActive(true);
        },
    };
}

interface useCountdownResult {
    ellapsedTime: number; // seconds, can be fractional.
    timeLeft: number; // seconds, can be fractional.
    stop: () => void;
    reset: () => void;
}

export function useCountdown({time, tickInterval, onEnd: onDone} : {
    time: number, // seconds
    tickInterval?: number, // milliseconds
    onEnd?: () => void,
}) : useCountdownResult {
    sAssert(time >= 0, "Bad time");
    sAssert(tickInterval === undefined || tickInterval >= 0, "Bad tick interval");

    const { ellapsedTime, stop, reset} = useTicker(tickInterval);
    const timeLeft = time - ellapsedTime;
    if(timeLeft <= 0) {
        stop();
        onDone && onDone();
    }

    return {ellapsedTime, timeLeft, stop, reset};
}

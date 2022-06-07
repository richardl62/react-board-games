import { useState, useEffect } from "react";
import { sAssert } from "./assert";

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
    count: number;
    stop: () => void;
    reset: () => void;
}

const defaultIntervalLength = 1000;

export function useTicker(
    /** interval in milliseconds.  Defaults to 1000. */
    optionalIntervalLenght?: number
) : useTickerResult {
    
    const intervalLenght = optionalIntervalLenght === undefined ? 
        defaultIntervalLength : optionalIntervalLenght;
    sAssert(intervalLenght >= 0, "Bad interval length");
        
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
        count: (now - start) / 1000, 
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
    /** Can be factional */
    secondsLeft: number;
    stop: () => void;
    reset: () => void;
}

export function useCountdown(initialSeconds: number) : useCountdownResult {
    const { count, stop, reset} = useTicker();
    const secondsLeft = initialSeconds - count;
    if(secondsLeft <= 0) {
        stop();
    }

    return {secondsLeft, stop, reset};
}

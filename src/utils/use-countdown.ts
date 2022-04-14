import { useState, useEffect } from "react";
import { sAssert } from "./assert";

interface useTickerResult {
    count: number;
    stop: () => void;
    reset: () => void;
}

const defaultIntervalLength = 1000;

export function useTicker(
    /** interval in milliseconds.  Defaults to 1000. */
    intervalLenght?: number
) : useTickerResult {
    sAssert(intervalLenght === undefined || intervalLenght >= 0, 
        "Bad interval passed to useClockTicks");

    const [count, setCount] = useState(0);
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (active) {
            const interval = setInterval(() => {
                setCount(count + 1);
            }, intervalLenght || defaultIntervalLength);
            
            return () => clearInterval(interval);
        }
    });

    return {
        count, 
        /** I thought that the 'active &&' was unneccessary. But react seemed to trigger 
         * an update even when state was already false */
        stop : () => active && setActive(false),
        reset: () => {
            setCount(0);
            setActive(true);
        },
    };
}

interface useCountdownResult {
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

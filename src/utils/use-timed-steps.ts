import { useEffect, useState } from "react";

export function useTimedSteps(
    { from, to, stepSize, stepTime }: { from: number; to: number; stepSize: number; stepTime: number; }): [number | null, () => void] {
    const [value, setValue] = useState(to);
    useEffect(() => {
        if (value < to) {
            const timer = setTimeout(() => setValue(value + stepSize), stepTime);
            return () => clearTimeout(timer);
        }
    }, [value, to, stepTime]);

    return [
        value < to ? value : null,
        () => setValue(from),
    ];
}

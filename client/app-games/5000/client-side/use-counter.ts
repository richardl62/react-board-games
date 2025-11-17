import { useState, useEffect } from "react";

export function useCounter(from: number, to: number, delay: number) {
    const [count, setCount] = useState(from);
    useEffect(() => {
        if (count < to) {
            const timer = setTimeout(() => setCount(count + 1), delay);
            return () => clearTimeout(timer);
        }
    }, [count, to, delay]);
    return count;
}

export function useDelay(delay: number, callback: (() => void) | null) {
    useEffect(() => {
        if (callback) {
            const timer = setTimeout(callback, delay);
            return () => clearTimeout(timer);
        }
    }, [delay, callback]);
}
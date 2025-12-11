import { useState, useEffect } from "react";

// Returns the last non-null/undefined value received. Or the value itself if
// a non-null/undefined value has not been received yet.
export function useLastNonNull<T>(value: T): T {
    const [lastNonNull, setLastNonNull] = useState(value);
    useEffect(() => {
        if (value !== null && value !== undefined) {
            setLastNonNull(value);
        }
    }, [value]);
    return lastNonNull;
}
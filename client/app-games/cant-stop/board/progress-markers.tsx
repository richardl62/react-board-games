import { JSX } from "react";

export function ProgressMarkers({colValue, height}: {colValue: number, height: number}  ) : JSX.Element {
    return <div>{`${colValue}-${height}`}</div>;
}
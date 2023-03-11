import React from "react";
import { useState } from "react";
import { useStandardBoardContext } from "../standard-board";

export function ServerConnection() : JSX.Element {
    const { isConnected } =  useStandardBoardContext();
    const [wasConnected, setWasConnected] = useState(true);
    const [reconnectionCount, setReconnectionCount] = useState(0);

    const warnings: string[] = [];

    if (!isConnected) {
        warnings.push("No connection to server");
    }

    if(wasConnected !== isConnected) {
        if(isConnected) {
            setReconnectionCount(reconnectionCount+1);
        }
        setWasConnected(isConnected);
    }

    if(reconnectionCount > 0) {
        warnings.push(`Server reconnection count: ${reconnectionCount}`);
    }

    return <div>
        {warnings.map((text) => 
            <div key={text}>{text}</div>
        )}
    </div>;
}
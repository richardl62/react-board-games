import React from "react";
import { useState } from "react";
import { useStandardBoardContext } from "../standard-board";

export function ServerConnection() : JSX.Element {
    const { isConnected, G: { startDate } } =  useStandardBoardContext();
    const [ wasConnected, setWasConnected] = useState(true);
    const [ reconnectionCount, setReconnectionCount ] = useState(0);
    const [ expectedStartDate, setExpectedStartDate ] = useState(0);

    const warnings: string[] = [];

    if (!isConnected) {
        warnings.push("No connection to server");
    }

    if ( expectedStartDate === 0) {
        setExpectedStartDate(startDate);
    } else if ( startDate !== expectedStartDate ) {
        warnings.push("Server has restarted - data may be lost");
    }

    if(wasConnected !== isConnected) {
        console.log("Connection to server", isConnected ? "restored" : "lost",
            (new Date()).toLocaleTimeString());
        if(isConnected) {
            setReconnectionCount(reconnectionCount+1);
        }
        setWasConnected(isConnected);
    }

    return <div>
        {warnings.map((text) => 
            <div key={text}>{text}</div>
        )}
    </div>;
}
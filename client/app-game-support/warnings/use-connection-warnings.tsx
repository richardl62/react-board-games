import { useState } from "react";
import { useStandardBoardContext } from "../standard-board";
import { ReadyState } from "react-use-websocket";

function readyStatusText( state: ReadyState) {
    const status = {
        [ReadyState.CONNECTING]: "connecting",
        [ReadyState.OPEN]: "open",
        [ReadyState.CLOSING]: "closing",
        [ReadyState.CLOSED]: "closed",
        [ReadyState.UNINSTANTIATED]: "uninstantiated",
    }[state];

    return status || "unknown";
}

export function useConnectionWarnings() : string [] {
    const { connectionStatus, playerData, G: { startDate } } = useStandardBoardContext();
    const [wasConnected, setWasConnected] = useState(true);
    const [expectedStartDate, setExpectedStartDate] = useState(0);

    if (connectionStatus === "offline") {
        return [];
    }

    const  { readyStatus, error, staleGameState } = connectionStatus;

    const isConnected = readyStatus === ReadyState.OPEN;
    if (wasConnected !== isConnected) {
        console.log("Connection to server", isConnected ? "restored" : "lost",
            (new Date()).toLocaleTimeString());

        setWasConnected(isConnected);
    }

    const warnings: string[] = [];
    
    if (expectedStartDate === 0) {
        setExpectedStartDate(startDate);
    } else if (startDate !== expectedStartDate) {
        warnings.push("Server has restarted - data may be lost");
    }

    if (!isConnected) {
        return [`No connection to server (status: ${readyStatusText(readyStatus)})`];
    } else {
        if (error) {
            warnings.push(`Connection error: ${error}`);
        }

        if (staleGameState) {
            warnings.push("Game data may be out of date");
        }
        
        for (const pId in playerData) {
            const { name, status } = playerData[pId];
            if (status === "notConnected") {
                warnings.push(`${name} is not connected`);
            }
        }
    }
    
    return warnings;
}

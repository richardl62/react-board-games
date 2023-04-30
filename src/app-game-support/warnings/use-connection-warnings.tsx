import { useState } from "react";
import { useStandardBoardContext } from "../standard-board";

export function useConnectionWarnings() : string [] {
    const { isConnected, playerData, G: { startDate } } = useStandardBoardContext();
    const [wasConnected, setWasConnected] = useState(true);
    const [reconnectionCount, setReconnectionCount] = useState(0);
    const [expectedStartDate, setExpectedStartDate] = useState(0);

    if (!isConnected) {
        return ["No connection to server"];
    }

    const warnings: string[] = [];
    if (expectedStartDate === 0) {
        setExpectedStartDate(startDate);
    } else if (startDate !== expectedStartDate) {
        warnings.push("Server has restarted - data may be lost");
    }

    if (wasConnected !== isConnected) {
        console.log("Connection to server", isConnected ? "restored" : "lost",
            (new Date()).toLocaleTimeString());
        if (isConnected) {
            setReconnectionCount(reconnectionCount + 1);
        }
        setWasConnected(isConnected);
    }

    for (const pId in playerData) {
        const { name, status } = playerData[pId];
        if (status === "notConnected") {
            warnings.push(`${name} is not connected`);
        }
    }
    
    return warnings;
}

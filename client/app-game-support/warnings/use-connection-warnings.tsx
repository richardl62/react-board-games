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
    const { connectionStatus, playerData } = useStandardBoardContext();

    if (connectionStatus === "offline") {
        return [];
    }

    const  { readyState: readyStatus, error } = connectionStatus;

    const warnings: string[] = [];
    

    if (readyStatus !== ReadyState.OPEN) {
        return [`No connection to server (status: ${readyStatusText(readyStatus)})`];
    } else {
        if (error) {
            warnings.push(`Connection error: ${error}`);
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

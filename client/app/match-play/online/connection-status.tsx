import { JSX } from "react";
import {ReadyState} from "react-use-websocket";
import { OnlineMatchData } from "./use-online-match-data";

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

export function ConnectionStatus({ onelineMatchData }: {
    onelineMatchData: OnlineMatchData;
}): JSX.Element {
    const { readyState, error } = onelineMatchData;

    let message : string | null = null;
    if (readyState !== ReadyState.OPEN) {
        message = `Connection status: ${readyStatusText(readyState)}`;
    } else if (error) {
        message = `Error: ${error}`;
    }

    return <div>{message}</div>;
}
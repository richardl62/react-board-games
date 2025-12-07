import { ReadyState } from "react-use-websocket";


export function readyStatusText(state: ReadyState) {
    const status = {
        [ReadyState.CONNECTING]: "connecting",
        [ReadyState.OPEN]: "open",
        [ReadyState.CLOSING]: "closing",
        [ReadyState.CLOSED]: "closed",
        [ReadyState.UNINSTANTIATED]: "uninstantiated",
    }[state];

    return status || "unknown";
}

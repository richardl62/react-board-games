import { JSX, useEffect, useState } from "react";

import { useStandardBoardContext } from "./standard-board";
import styled from "styled-components";
import { getPlayerStatus } from "./player-status";

const WarningDiv = styled.div`
    span:first-child {
        color: red;
        font-weight: 600;
        margin-right: 0.2em;
    }
    margin-bottom: 0.2em;
`;

// Return true at the given interval after a call in which flag is true.
// Later calls in which flag is still true have no effect. Later calls with
// the flag false (or with a different interval) reset the timer. 
function useDelayedValue(value: boolean, delay: number) {
  const [delayedValue, setDelayedValue] = useState(false);

  useEffect(() => {
    if (!value) {
      setDelayedValue(false);
      return;
    }

    const handler = setTimeout(() => {
        setDelayedValue(true);
    }, delay);

    // Run when value or delay changes
    return () => {
      clearTimeout(handler);
    };

  }, [value, delay]);

  return delayedValue;
}

// In general return the given text. But to avoid jitters return any non-null
// text for the given duration even if the input changes.
function useStableText(text: string | null, minDuration: number): string | null {
    const [stableText, setStableText] = useState<string | null>(text);
    const [lastChangeTime, setLastChangeTime] = useState<number>(Date.now());

    useEffect(() => {
        if (text === stableText) {
            return;
        }

        const now = Date.now();
        const timeSinceChange = now - lastChangeTime;

        if (stableText !== null && timeSinceChange < minDuration) {
            // Need to wait before changing to null
            const remainingTime = minDuration - timeSinceChange;
            const handler = setTimeout(() => {
                setStableText(text);
                setLastChangeTime(Date.now());
            }, remainingTime);

            return () => {
                clearTimeout(handler);
            };
        } else {
            // Can change immediately
            setStableText(text);
            setLastChangeTime(now);
        }
    }, [text, stableText, lastChangeTime, minDuration]);

    return stableText;
}

function useWarnings() : {
    connectionIssue: string | null,
    disconnectedPlayers: string[],
    errorInLastAction: string | null,
    lastActionIgnored: boolean,
} {
    const {
        matchStatus: { 
            connectionStatus, 
            errorInLastAction, 
            actionRequestStatus: { lastActionIgnored, waitingForServer },
            playerData
        }, 
        ctx,

    } = useStandardBoardContext();

    // To avoid jitters have a short delay before reporting server delays;
    const reportServerDelay = useDelayedValue(waitingForServer, 500);

    let connectionIssue : string | null = null;
    if ( connectionStatus !== "connected" ) {
        if ( connectionStatus === "connecting" ) {
            connectionIssue = "Connecting to server...";
        } else {
            const reason = connectionStatus.closeEvent.reason || `closure code ${connectionStatus.closeEvent.code}`;
            connectionIssue = `No connection to server (${reason})`;
            if (connectionStatus.reconnecting) {
                connectionIssue += ": attempting reconnection ...";
            }
        }
    } else if (reportServerDelay) {
        connectionIssue = "Waiting for server...";
    }
    
    const disconnectedPlayers: string[] = [];
    for (const pid of ctx.playOrder) {
        const status = getPlayerStatus(playerData, pid);

        // Warn only about players that have joined but are not now connected
        if (status.connectionStatus === "not connected") {
            disconnectedPlayers.push(status.name);
        }
    }

    return {
        connectionIssue,
        disconnectedPlayers,
        errorInLastAction,
        lastActionIgnored,
    };
}

function OptionalWarning({text} : {text: string | null}): JSX.Element {
    if (!text) {
        return <></>;
    }
    return <WarningDiv>
        <span>WARNING: </span>
        <span>{text}</span>
    </WarningDiv>;
}

// Display warning about connections to the server or unexpected errors.
// (Individual games should handle warnings about game-specific issues 
// such as illegal moves.)
export function Warnings(): JSX.Element {
    const {
        connectionIssue,
        disconnectedPlayers,
        errorInLastAction,
        lastActionIgnored,
    } = useWarnings();

    const disconnectedMessage = disconnectedPlayers.length === 0 ? null :
        `${disconnectedPlayers.join(", ")} ${disconnectedPlayers.length === 1 ? "is" : "are"} not connected.`;
    
    const lastActionIgnoredText = lastActionIgnored ? "Last move was ignored by the server." : null;
    const errorInLastActionText = errorInLastAction ? `Error in last action: ${errorInLastAction}` : null;

    const stableConnectionIssue = useStableText(connectionIssue, 3000);
    const stableDisconnectedMessage = useStableText(disconnectedMessage, 3000);
    const stableLastActionIgnored = useStableText(lastActionIgnoredText, 3000);
    const stableErrorInLastAction = useStableText(errorInLastActionText, 3000);

    return <div>
        <OptionalWarning text={stableConnectionIssue} />
        <OptionalWarning text={stableDisconnectedMessage} />
        <OptionalWarning text={stableLastActionIgnored} />
        <OptionalWarning text={stableErrorInLastAction} />
    </div>;
}

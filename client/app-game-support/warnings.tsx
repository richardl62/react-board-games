import { JSX, useEffect, useState } from "react";
import { useStandardBoardContext } from "./standard-board";
import styled from "styled-components";
import { getPlayerStatus } from "./player-status";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { Ctx } from "@shared/game-control/ctx";
import { MatchStatus } from "./board-props";
import { ConnectionStatus } from "@/app/match-play/online/use-server-connection";

const WarningDiv = styled.div`
    span:first-child {
        color: darkred;
        font-weight: 600;
        margin-right: 0.2em;
    }
    margin-bottom: 0.2em;
`;

// Return the value if it has been unchanged for the given interval, otherwise return null. 
function useStableValue<ValueT>(value: ValueT, waitTime: number): ValueT | null {
    const [settledValue, setSettledValue] = useState<ValueT>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSettledValue(value);
        }, waitTime);
        return () => clearTimeout(handler);
    }, [value, waitTime]);

    return value === settledValue ? settledValue : null;
}

// In general return the given text. But to avoid jitters return any non-null
// text for the given duration even if the input changes. (Code by GitHub Copilot.)
function useJitterFreeText(text: string | null, minDuration: number): string | null {
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


function connectionIssueDescription(
    connectionStatus: ConnectionStatus,
    waitingForServer: boolean,  
): string | null {
    if (connectionStatus === "connected") {
        return waitingForServer ? "Waiting for server..." : null;
    } else if (connectionStatus === "connecting") {
        return "Connecting to server...";
    } else {
        const reason = connectionStatus.closeEvent.reason || `closure code ${connectionStatus.closeEvent.code}`;
        let connectionIssue = `No connection to server (${reason})`;
        if (connectionStatus.reconnecting) {
            connectionIssue += ": attempting reconnection ...";
        }
        return connectionIssue;
    }   
}

// If there is a persistent problem with connection or a move has been ignored,
// return a string describing the issue otherwise return return null.
function useConnectionIssue(
    matchStatus: MatchStatus,
    acceptableWait: number // milliseconds 
) : string | null {
    const {connectionStatus, actionRequestStatus: {waitingForServer }} = matchStatus;

    const stableWaitingForServer = useStableValue( waitingForServer, acceptableWait);
    const stableConnectionStatus = useStableValue( connectionStatus, acceptableWait);

    if (stableWaitingForServer  || stableConnectionStatus ) {
        return connectionIssueDescription(connectionStatus, stableWaitingForServer  === true);    
    }

    return null;
}

// If any players are disconnected return a string that names them. Or return null 
// all players are connected.
function usePlayersWarning(
    playerData: PublicPlayerMetadata[],
    ctx: Ctx,
    acceptableWait: number // milliseconds 
) : string | null
{
    const warning = () => {
        const disconnectedPlayers: string[] = [];
        for (const pid of ctx.playOrder) {
            const status = getPlayerStatus(playerData, pid);

            // Warn only about players that have joined but are not now connected
            if (status.connectionStatus === "not connected") {
                disconnectedPlayers.push(status.name);
            }
        }

        if (disconnectedPlayers.length === 0) {
            return null;
        }
        return `${disconnectedPlayers.join(", ")} ${disconnectedPlayers.length === 1 ? "is" : "are"} not connected.`;
    };

    return useStableValue(warning(), acceptableWait);
}


function Warning({text, minDisplayTime} : 
    {text: string | null, minDisplayTime: number}): JSX.Element {
    const stableText = useJitterFreeText(text, minDisplayTime);
    if (!stableText) {
        return <></>;
    }
    return <WarningDiv>
        <span>WARNING: </span>
        <span>{stableText}</span>
    </WarningDiv>;
}

// Display warning about connections to the server or unexpected errors.
// (Individual games should handle warnings about game-specific issues 
// such as illegal moves.)
export function Warnings(): JSX.Element {
    const networkIssueWait = 2000; // milliseconds - wait before reporting a possibly transient network issue.
    const minWarningDisplayTime = 2000; // milliseconds - once a warning is displayed, display it for at least this long.

    const { matchStatus, ctx } = useStandardBoardContext();
    const { errorInLastAction, actionRequestStatus: {lastActionIgnored} } = matchStatus;

    const connectionWarning = useConnectionIssue(matchStatus, networkIssueWait);
    const playersWarning = usePlayersWarning(matchStatus.playerData, ctx, networkIssueWait);
    const errorInActionWarning = errorInLastAction ? `Error in last action: ${errorInLastAction}` : null;

    useEffect(() => {
        if (lastActionIgnored) {
            console.warn("Last action was ignored.");
        }
    }, [lastActionIgnored]);

    return <div>
        <Warning text={connectionWarning} minDisplayTime={minWarningDisplayTime} />
        <Warning text={playersWarning} minDisplayTime={minWarningDisplayTime} />
        <Warning text={errorInActionWarning} minDisplayTime={minWarningDisplayTime} />
    </div>;
}

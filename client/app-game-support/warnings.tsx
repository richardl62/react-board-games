import { JSX, useEffect, useState } from "react";

import { useStandardBoardContext } from "./standard-board";
import styled from "styled-components";
import { ReadyState } from "react-use-websocket";
import { readyStatusText } from "@utils/ready-status-text";

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

export function Warnings(): JSX.Element {
    const {moveError, connectionStatus, playerData } = useStandardBoardContext();  
    
    const waitingForServer = connectionStatus !== "offline" && connectionStatus.waitingForServer;
    const reportServerDelay = useDelayedValue(waitingForServer, 1000 /* ms */);

    const warnings: string[] = [];
    if (reportServerDelay) {
        warnings.push("Waiting for server...");
    }

    if (connectionStatus !== "offline") {
        const {readyState } = connectionStatus;

        if (readyState !== ReadyState.OPEN) {
            warnings.push(`No connection to server (status: ${readyStatusText(readyState)})`);
        } else {
            for (const pId in playerData) {
                const { name, status } = playerData[pId];
                if (status === "notConnected") {
                    warnings.push(`${name} is not connected`);
                }
            }
        }
    }

    if(moveError) {
        warnings.push("Problem during move " + moveError);
    }
    
    
    return <>
        {warnings.map((text) => 
            <WarningDiv key={text}>
                <span>WARNING: </span>
                <span>{text}</span>
            </WarningDiv>
        )}
    </>;
}

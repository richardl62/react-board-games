import { JSX, useEffect, useState } from "react";

import { useStandardBoardContext } from "./standard-board";
import styled from "styled-components";

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
    const warnings: string[] = [];
    const {errorInLastAction, connectionStatus, getPlayerConnectionStatus, getPlayerName, waitingForServer, ctx} = useStandardBoardContext();  
    const reportServerDelay = useDelayedValue(waitingForServer, 1000 /* ms */);

    if (reportServerDelay) {
        warnings.push("Waiting for server...");
    }

    if ( connectionStatus === "connected" ) {
        // Do nothing
    } else if (connectionStatus === "connecting") {
        warnings.push("Connecting to server...");
    } else {
        let message = "No connection to server";
        if (connectionStatus.reconnecting) {
            message += " (attempting reconnection)";
        }
        warnings.push(message);
    }

    for (const pid in ctx.playOrder) {
        if (getPlayerConnectionStatus(pid)  === "not connected") {
            warnings.push(`${getPlayerName(pid)} is not connected`);
        }
    }

    if(errorInLastAction) {
        warnings.push("Problem during move " + errorInLastAction);
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

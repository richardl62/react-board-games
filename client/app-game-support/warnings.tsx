import { JSX, useEffect, useState } from "react";

import { useStandardBoardContext } from "./standard-board";
import styled from "styled-components";
import { playerStatus } from "./player-status";

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
    const {
        matchStatus: { connectionStatus, errorInLastAction, waitingForServer,  playerData}, 
    } = useStandardBoardContext();  
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

    for (const pd of playerData) {
        const status = playerStatus(pd);

        if (status.connectionStatus === "not connected") {
            warnings.push(`${status.name} is not connected`);
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

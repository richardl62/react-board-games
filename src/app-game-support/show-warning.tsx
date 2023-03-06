import React, { useState } from "react";
import styled from "styled-components";
import { WrappedGameProps } from "./wrapped-game-props";


const WarningsDiv = styled.div`
    *:first-child {
        color: red;
        text-transform: uppercase;
    }

    *:not(:first-child) {
        margin-left: 0.5em;
    }
`;

/** Show warnings, if any, about general (non-game-specifiy) issues.
 * Currently, the only warning is about players being off line.
 */
function ConnectionWarnings(props: WrappedGameProps) {

    const warnings: string[] = [];

    if (!props.isConnected) {
        warnings.push("No connection to server");
    } else {
        for (const pId in props.playerData) {
            const { name, status } = props.playerData[pId];
            if (status === "notConnected") {
                warnings.push(`${name} is not connected`);
            }
        }
    }

    if (warnings.length === 0) {
        return null;
    }

    return (
        <WarningsDiv>
            <span key='-'>Warning:</span>
            {warnings.map(w => <span key={w}>{w}</span>)}
        </WarningsDiv>
    );
}

function ReconnectionCount(props: WrappedGameProps) {
    const { isConnected } = props;
    const [wasConnected, setWasConnected] = useState(true);
    const [reconnectionCount, setReconnectionCount] = useState(0);

    if(wasConnected !== isConnected) {
        if(isConnected) {
            setReconnectionCount(reconnectionCount+1);
        }
        setWasConnected(isConnected);
    }

    return reconnectionCount > 0 ?
        <div>{`Server reconnection count: ${reconnectionCount}`}</div> :
        null;
}

export function GameWarnings(props: WrappedGameProps): JSX.Element {
    return <>
        <ReconnectionCount {...props}/>
        <ConnectionWarnings {...props}/>
    </>;
}

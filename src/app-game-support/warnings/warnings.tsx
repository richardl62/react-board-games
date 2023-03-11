import React, { useState } from "react";
import styled from "styled-components";
import { ErrorMessage } from "./error-message";
import { WrappedGameProps } from "../wrapped-game-props";

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
function PlayerConnections(props: WrappedGameProps) {

    const warnings: string[] = [];

    for (const pId in props.playerData) {
        const { name, status } = props.playerData[pId];
        if (status === "notConnected") {
            warnings.push(`${name} is not connected`);
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

function ServerConnection(props: WrappedGameProps) {
    const { isConnected } = props;
    const [wasConnected, setWasConnected] = useState(true);
    const [reconnectionCount, setReconnectionCount] = useState(0);

    const warnings: string[] = [];

    if (!props.isConnected) {
        warnings.push("No connection to server");
    }

    if(wasConnected !== isConnected) {
        if(isConnected) {
            setReconnectionCount(reconnectionCount+1);
        }
        setWasConnected(isConnected);
    }

    if(reconnectionCount > 0) {
        warnings.push(`Server reconnection count: ${reconnectionCount}`);
    }

    return <div>
        {warnings.map((text) => 
            <div key={text}>{text}</div>
        )}
    </div>;
}

export function Warnings(props: WrappedGameProps): JSX.Element {
    return <>
        <ErrorMessage category="Error during move" message={props.G.moveError} />
        
        <ServerConnection {...props}/>
        <PlayerConnections {...props}/>
    </>;
}

import { JSX } from "react";

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

export function Warnings(): JSX.Element {
    const {G: {moveError}, connectionStatus, playerData } = useStandardBoardContext();  
    
    const warnings: string[] = [];

    if (connectionStatus !== "offline") {
        const { readyState: readyStatus, error } = connectionStatus

        if (readyStatus !== ReadyState.OPEN) {
            warnings.push(`No connection to server (status: ${readyStatusText(readyStatus)})`);
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

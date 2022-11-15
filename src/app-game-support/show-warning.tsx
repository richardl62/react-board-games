import React from "react";
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
export function GameWarnings(props: WrappedGameProps): JSX.Element | null {

    const warnings: string[] = [];

    for(const pId in props.playerData) {
        const {name, status } = props.playerData[pId];
        if(status === "notConnected") {
            warnings.push(`${name} is not connected`);
        }
    }

    if(warnings.length === 0) { 
        return null;
    }

    return (
        <WarningsDiv>
            <span key='-'>Warning:</span>
            {warnings.map(w => <span key={w}>{w}</span>)}
        </WarningsDiv>
    );   
}

import React from "react";
import { WrappedGameProps } from "../bgio";
import styled from "styled-components";


const WarningsDiv = styled.div`
    display: inline;
    *:first-child {
        color: red;
        text-transform: uppercase;
    }

    *:not(:first-child) {
        margin-left: 0.5em;
    }
`;

/** Show warnings, if any, about general (non-game-specifiy) issues.
 * Currently, this the only warning is players being off line.
 */
export function GameWarnings(props: WrappedGameProps): JSX.Element | null {


    const warnings: string[] = [];

    for(const pId in props.playerData) {
        const {name, status } = props.playerData[pId];
        if(status === "offline") {
            warnings.push(`${name} is offline`);
        }
    }

    if(warnings.length === 0) { 
        return null;
    }

    return (
        <WarningsDiv>
            <span key='-'>Warnings:</span>
            {warnings.map(w => <span key={w}>{w}</span>)}
        </WarningsDiv>
    );   
}

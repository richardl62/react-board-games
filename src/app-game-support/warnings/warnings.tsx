import { JSX } from "react";

import { useConnectionWarnings } from "./use-connection-warnings";
import { useStandardBoardContext } from "../standard-board";
import styled from "styled-components";

const WarningDiv = styled.div`
    span:first-child {
        color: red;
        font-weight: 600;
        margin-right: 0.2em;
    }
    margin-bottom: 0.2em;
`;

export function Warnings(): JSX.Element {
    const context = useStandardBoardContext();  
    const { moveError } = context.G;

    const warnings = useConnectionWarnings();
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

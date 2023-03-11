import React from "react";
import { ErrorMessage } from "./error-message";
import { PlayerConnections } from "./player-connections";
import { ServerConnection } from "./server-connection";
import { useStandardBoardContext } from "../standard-board";


export function Warnings(): JSX.Element {
    const { G: {moveError} } = useStandardBoardContext();
    return <>
        <ErrorMessage category="Error during move" message={moveError} />
        
        <ServerConnection />
        <PlayerConnections />
    </>;
}

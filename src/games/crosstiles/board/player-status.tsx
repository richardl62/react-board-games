import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";

const Name = styled.span`
    margin-right: 0.2em;  
`;
const Message = styled.span`
    margin-right: 0.5em;
`;

interface PlayerStatusProps {
    message: (pid: string) => string | null | undefined;
}

export function PlayerStatus(props: PlayerStatusProps): JSX.Element {
    const { message } = props;

    const context = useCrossTilesContext();
    const { nPlayers, nthPlayerID } = context;
    const { getPlayerName } = context.wrappedGameProps;


    /* KLUDGE: Put all the done/ not done messages on a single line. Previously, 'Time Left' could be
    hidden in 3+ player games.  */
    const elems: JSX.Element[] = [];
    for (let i = 0; i < nPlayers; ++i) {
        const pid = nthPlayerID(i);
        const msg = message(pid);
        if (msg) {
            elems.push(
                <span>
                    <Name key={pid + "name"}>{getPlayerName(pid) + ":"}</Name>
                    <Message key={pid + "msg"}>{msg}</Message>
                </span>
            );
        }
    }

    return <div>{elems}</div>;
}

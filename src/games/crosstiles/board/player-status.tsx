import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";

const PlayerStatusDiv = styled.div`
    display: grid;
    grid-template-columns: max-content max-content;
    row-gap: 4px;
    column-gap: 4px;
`;
interface PlayerStatusProps {
    message: (pid: string) => string | null | undefined;
}
export function PlayerStatus(props: PlayerStatusProps): JSX.Element {
    const { message } = props;

    const context = useCrossTilesContext();
    const { nPlayers, nthPlayerID } = context;
    const { getPlayerName } = context.wrappedGameProps;


    const elems: JSX.Element[] = [];
    for (let i = 0; i < nPlayers; ++i) {
        const pid = nthPlayerID(i);
        const msg = message(pid);
        if (msg) {
            elems.push(<span key={pid + "name"}>{getPlayerName(pid) + ":"}</span>);
            elems.push(<span key={pid + "msg"}>{msg}</span>);
        }
    }

    return <PlayerStatusDiv>{elems}</PlayerStatusDiv>;
}

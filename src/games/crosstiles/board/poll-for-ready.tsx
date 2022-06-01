import React from "react";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

const PlayerStatusDiv = styled.div`
    display: grid;
    grid-template-columns: max-content max-content;
    row-gap: 4px;
    column-gap: 4px;
`;

export function PollForReady() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData } = context;
    const { moves, getPlayerName, playerID } = context.wrappedGameProps;

    if(stage !== GameStage.pollingForReady) {
        return null;
    }

    const elems: JSX.Element[] = [];

    for(const pid in playerData) {
        const ready = playerData[pid].ready;

        elems.push(<span key={pid+"name"}>{getPlayerName(pid)+":"}</span>);
        elems.push(<span key={pid+"ready"}>{ready ? "Ready" : "Waiting" }</span>);
    }

    const ready = playerData[playerID].ready;
    return <div>
        <PlayerStatusDiv>
            {elems}
        </PlayerStatusDiv>
        {!ready && <button onClick={() => moves.playerReady()}>Start round</button>}
    </div>;
}
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

export function ReadyToStartGame() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData } = context;
    const { moves, getPlayerName, playerID } = context.wrappedGameProps;

    if(stage !== GameStage.starting) {
        return null;
    }

    const elems: JSX.Element[] = [];

    for(const pid in playerData) {
        const ready = playerData[pid].readyToStartGame;

        elems.push(<span key={pid+"name"}>{getPlayerName(pid)+":"}</span>);
        elems.push(<span key={pid+"ready"}>{ready ? "Ready" : "Not Ready" }</span>);
    }

    const ready = playerData[playerID].readyToStartGame;
    return <div>
        <PlayerStatusDiv>
            {elems}
        </PlayerStatusDiv>
        {!ready && <button onClick={() => moves.readyToStartGame()}>Start First Round</button>}
    </div>;
}
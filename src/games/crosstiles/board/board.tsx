import React from "react";
import styled from "styled-components";
import { WaitingForPlayers } from "../../../app-game-support";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { PollForReady } from "./poll-for-ready";

const BoardDiv = styled.div`
   display: inline-block;
   border: 1px black solid;
   margin: 4px;
   padding: 4px;  
`;

const Name = styled.div`
    font-weight: bold;
    margin-bottom: 2px;
`;

export function Board(): JSX.Element {
    const context = useCrossTilesContext();
    const {wrappedGameProps } = context;
    const { playerID, getPlayerName } = wrappedGameProps;

    if(!wrappedGameProps.allJoined) {
        <WaitingForPlayers {...wrappedGameProps} />;
    }

    const name = getPlayerName(playerID);
    return <BoardDiv>
        <Name>{name}</Name>

        <PollForReady />
    </BoardDiv>;
}

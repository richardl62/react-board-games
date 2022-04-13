import React from "react";
import styled from "styled-components";
import { WaitingForPlayers } from "../../../app-game-support";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameOver } from "./game-over";
import { MakeGrid } from "./make-grid";
import { PollForReady } from "./poll-for-ready";
import { Scoring } from "./scoring";

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

        {/* The functions below return null if the game is not at the appropriate stage */}
        <PollForReady />
        <MakeGrid />
        <Scoring />
        <GameOver />
    </BoardDiv>;
}

import React from "react";
import styled from "styled-components";
import { WaitingForPlayers } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameOver } from "./game-over";
import { MakeGrid } from "./make-grid";
import { PollForReady } from "./poll-for-ready";
import { ScoreCards } from "./score-cards";
import { Scoring } from "./scoring";

const BoardDiv = styled.div`
   display: inline-block;
   margin: 4px;
   padding: 4px;  
`;

export function Board(): JSX.Element {
    const context = useCrossTilesContext();
    const {wrappedGameProps, serverError } = context;

    if(!wrappedGameProps.allJoined) {
        <WaitingForPlayers {...wrappedGameProps} />;
    }

    return <BoardDiv>
        <ErrorMessage category="server error" message={serverError} />

        <div>
            {/* Start of functions the return null if the game is not at the appropriate stage */}
            <PollForReady />
            <MakeGrid />
            <Scoring />
            <GameOver />
            {/* Start of functions the return null if the game is not at the appropriate stage */}
        </div>
        
        <ScoreCards />
    </BoardDiv>;
}

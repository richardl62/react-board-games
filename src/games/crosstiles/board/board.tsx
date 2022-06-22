import React from "react";
import styled from "styled-components";
import { WaitingForPlayers, WrappedGameProps } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";
import { GameOver } from "./game-over";
import { MakeGrid } from "./make-grid";
import { ReadyToStartGame } from "./ready-to-start-game";
import { ScoreCards } from "./score-cards";
import { Scoring } from "./scoring";
import { SetOptionsOrWait } from "./set-options";

const BoardDiv = styled.div`
   display: inline-block;
   margin: 4px;
   padding: 4px;  
`;

const StagesDiv = styled.div`
    margin-bottom: 6px;
`;

function GameStages() {
    return <StagesDiv>
        <div>Hello from GameStages</div>
        
        {/* Start of functions that return null if the game is not at the appropriate stage */}

        {/* <ReadyToStartGame />
        <MakeGrid />
        <Scoring />
        <GameOver /> */}
        {/* End of functions that return null if the game is not at the appropriate stage */}

        {/* <ScoreCards /> */}

    </StagesDiv>;
}

interface BoardProps {
    gameProps: WrappedGameProps;
} 

export function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props; 
    const crossTilesGameProps = gameProps as unknown as CrossTilesGameProps;

    if(!crossTilesGameProps.allJoined) {
        <WaitingForPlayers {...gameProps} />;
    }

    const { G: {stage, serverError} } = crossTilesGameProps;

    return <BoardDiv>
        <div>Hello</div>
        <ErrorMessage category="server error" message={serverError} />

        {stage === GameStage.settingOptions ?  
            <SetOptionsOrWait gameProps={crossTilesGameProps} /> : <GameStages/>}
    </BoardDiv>;
}


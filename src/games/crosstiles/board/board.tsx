import React from "react";
import styled from "styled-components";
import { GameWarnings, WaitingForPlayers, WrappedGameProps } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";
import ContextProviderPlus from "./context-provider-plus";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";
import { EndOfGame } from "./end-of-game";
import { MakeGrid } from "./make-grid";
import { ReadyToStartGame } from "./ready-to-start-game";
import { ScoreCards } from "./score-cards";
import { Scoring } from "./scoring";
import { SetOptionsOrWait as Setup } from "./setup";

const BoardDiv = styled.div`
   display: inline-block;
   margin: 4px;
   padding: 4px;  
`;

const StagesDiv = styled.div`
    margin-bottom: 6px;
`;


interface GameStagesProps {
    gameProps: CrossTilesGameProps;
}

function GameStages(props: GameStagesProps) {
    return <ContextProviderPlus {...props}>
        <StagesDiv>
            {/* Start of functions that return null if the game is not at the appropriate stage */}
            <ReadyToStartGame />
            <MakeGrid />
            <Scoring />
            <EndOfGame />
            {/* End of functions that return null if the game is not at the appropriate stage */}
        </StagesDiv>

        <ScoreCards />
    </ContextProviderPlus>;
}


interface BoardProps {
    gameProps: WrappedGameProps;
} 

function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props; 
    const crossTilesGameProps = gameProps as unknown as CrossTilesGameProps;

    if(!crossTilesGameProps.allJoined) {
        <WaitingForPlayers {...gameProps} />;
    }

    const { G: {stage, serverError} } = crossTilesGameProps;

    return <BoardDiv>
        <GameWarnings {...gameProps}/>
        <ErrorMessage category="server error" message={serverError} />

        {stage === GameStage.setup ?  
            <Setup gameProps={crossTilesGameProps} /> : 
            <GameStages gameProps={crossTilesGameProps} />}
    </BoardDiv>;
}

export default Board;
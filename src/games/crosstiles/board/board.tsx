import React from "react";
import styled from "styled-components";
import { ErrorMessage } from "../../../utils/error-message";
import ContextProviderPlus from "./context-provider-plus";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { GameStage } from "../server-side/server-data";
import { EndOfGame } from "./end-of-game";
import { MakeGrid } from "./make-grid";
import { ReadyToStartGame } from "./ready-to-start-game";
import { ScoreCards } from "./score-cards";
import { Scoring } from "./scoring";
import { SetOptionsOrWait } from "./setup";
import { aboveScoreCardsHeight } from "./style";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";

const BoardDiv = styled.div`
   display: inline-block;
   margin: 4px;
   padding: 4px;  
`;

const StagesDiv = styled.div`
    margin-bottom: 6px;
    
    // KLUDGE?: Specify the (hard coded) height to prevent the score cards
    // moving as the connect above them changes. This also allows inner containers
    // to use, e.g. height: 100%
    height: ${aboveScoreCardsHeight};
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

function Board(): JSX.Element {
    const crossTilesGameProps = useStandardBoardContext() as CrossTilesGameProps;

    const { G: {stage, serverError} } = crossTilesGameProps;

    return <BoardDiv>
        <ErrorMessage category="server error" message={serverError} />

        {stage === GameStage.setup ?  
            <SetOptionsOrWait gameProps={crossTilesGameProps} /> : 
            <GameStages gameProps={crossTilesGameProps} />}
    </BoardDiv>;
}

export default Board;
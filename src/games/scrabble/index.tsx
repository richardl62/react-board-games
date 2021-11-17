import { Ctx } from "boardgame.io";
import React from "react";
import { sAssert } from "shared/assert";
import { BgioGameProps } from "shared/bgio-game-props";
import { AppGame } from "shared/types";
import { GeneralGameState, isGlobalGameState, startingGeneralGameState, bgioMoves, useActions } from "./actions";
import { Board } from "./board";
import { configs, ScrabbleConfig } from "./config";

interface BoardWrapperProps {
    appBoardProps: BgioGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const gameDataProps = props.appBoardProps as BgioGameProps<GeneralGameState>;
    sAssert(isGlobalGameState(gameDataProps.G));
    
    const actions = useActions(gameDataProps, props.config);
    return <Board actions={actions} />;
}

function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGeneralGameState(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: BgioGameProps) => <BoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;

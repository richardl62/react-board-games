import { Ctx } from "boardgame.io";
import React from "react";
import { AppBoardProps } from "shared/app-board-props";
import { AppGame } from "shared/types";
import { bgioMoves, startingGameData, useActions } from "./actions";
import { Board } from "./board";
import { configs, ScrabbleConfig } from "./scrabble-config";

interface BoardWrapperProps {
    appBoardProps: AppBoardProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const actions = useActions(props.appBoardProps, props.config);
    return <Board actions={actions} />;
}

function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGameData(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: AppBoardProps) => <BoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;
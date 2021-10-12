import { Ctx } from "boardgame.io";
import React from "react";
import { AppBoardProps } from "shared/app-board-props";
import { AppGame } from "shared/types";
import { Board } from "./board";
import { bgioMoves, useActions } from "./game-control";
import { GameData, startingGameData } from "./game-data";
import { ScrabbleConfig } from "./scrabble-config";

interface BoardWrapperProps {
    appBoardProps: AppBoardProps<GameData>;
    config: ScrabbleConfig;
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const actions = useActions(props.appBoardProps, props.config);
    return <Board actions={actions} />;
}

export function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGameData(ctx, config),
  
        moves: bgioMoves,
  
        board: (props: AppBoardProps<GameData>) => <BoardWrapper
            appBoardProps={props} config={config}
        />
    };
}
import { Ctx } from "boardgame.io";
import React from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { AppGame } from "shared/types";
import { bgioMoves, startingGameData, useActions } from "./actions";
import { GameData, isGameData } from "./actions/game-data";
import { Board } from "./board";
import { configs, ScrabbleConfig } from "./config";

interface BoardWrapperProps {
    appBoardProps: GeneralGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const gameDataProps = props.appBoardProps as GeneralGameProps<GameData>;
    sAssert(isGameData(gameDataProps.G));
    
    const actions = useActions(gameDataProps, props.config);
    return actions ? <Board actions={actions} /> : <h1>Waiting for update</h1>;
}

function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGameData(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: GeneralGameProps) => <BoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;

// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { useEffect } from "react";
import { AppGame, BoardProps } from "../app-game-support";
import { RequiredServerData } from "../app-game-support/required-server-data";
import { WrappedGameProps, makeWrappedGameProps } from "../app-game-support/wrapped-game-props";


function gameStatus(gameProps: WrappedGameProps) {
    if(!gameProps.allJoined) {
        return "Game not started";
    } else {
        const player = gameProps.getPlayerName(gameProps.ctx.currentPlayer);
        return `${player} to play`;
    }
}

interface GameBoardProps {
    bgioProps: BoardProps<RequiredServerData>;
    game: AppGame;
}

export function GameBoard(props: GameBoardProps) : JSX.Element {
    const {bgioProps, game} = props;

    const gameProps = makeWrappedGameProps(bgioProps);

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}


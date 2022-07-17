// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { useEffect } from "react";
import { AppGame, BoardProps } from "../app-game-support";
import { WrappedGameProps, makeWrappedGameProps } from "../app-game-support/wrapped-game-props";


function gameStatus(gameProps: WrappedGameProps) {
    if(!gameProps.allJoined) {
        return "Game not started";
    } else {
        const player = gameProps.getPlayerName(gameProps.ctx.currentPlayer);
        return `${player} to play`;
    }
}

interface GameBoardProps<G> {
    bgioProps: BoardProps<G>;
    game: AppGame;
}

export function GameBoard<G>(props: GameBoardProps<G>) : JSX.Element {
    const {bgioProps, game} = props;

    const gameProps = makeWrappedGameProps(bgioProps);

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}


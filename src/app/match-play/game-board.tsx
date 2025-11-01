import { JSX, useEffect } from "react";
import { AppGame, BoardProps } from "@/app-game-support";
import { RequiredServerData } from "@game-control/required-server-data";
import { WrappedGameProps, useWrappedGameProps } from "@/app-game-support/wrapped-game-props";

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

    const gameProps = useWrappedGameProps(bgioProps);

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}


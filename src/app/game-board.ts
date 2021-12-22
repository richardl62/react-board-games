// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps } from "../bgio";
import { makeWrappedGameProps } from "../bgio/wrapped-game-props";
import { AppGame } from "../shared/types";


interface GameBoardProps<G> {
    bgioProps: BoardProps<G>;
    game: AppGame;
}

export function GameBoard<G>(props: GameBoardProps<G>) : JSX.Element {
    const {bgioProps, game} = props;
    return game.board(makeWrappedGameProps(bgioProps));
}


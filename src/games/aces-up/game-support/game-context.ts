import { useStandardBoardContext } from "../../../app-game-support/make-standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../game-control/moves";
import { ServerData } from "../game-control/server-data";

export type GameContext = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : GameContext {
    return useStandardBoardContext() as GameContext;
}

